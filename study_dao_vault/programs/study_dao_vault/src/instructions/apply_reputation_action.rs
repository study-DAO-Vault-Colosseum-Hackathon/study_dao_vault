use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke_signed, system_instruction},
};

use crate::{
    constants::*,
    error::StudyDaoError,
    events::ReputationActionApplied,
    state::{ActionReceipt, BadgeTier, Platform, ReputationAction, SolReserve, UserReputation},
};

#[derive(Accounts)]
#[instruction(action: ReputationAction, event_id: [u8; 32], actor: Pubkey)]
pub struct ApplyReputationAction<'info> {
    #[account(
        mut,
        seeds = [PLATFORM_SEED],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(
        mut,
        seeds = [SOL_RESERVE_SEED, platform.key().as_ref()],
        bump = platform.sol_reserve_bump
    )]
    pub sol_reserve: Account<'info, SolReserve>,
    #[account(
        init_if_needed,
        payer = relayer,
        space = 8 + UserReputation::LEN,
        seeds = [USER_REPUTATION_SEED, user.key().as_ref()],
        bump
    )]
    pub user_reputation: Account<'info, UserReputation>,
    #[account(
        init,
        payer = relayer,
        space = 8 + ActionReceipt::LEN,
        seeds = [ACTION_RECEIPT_SEED, user.key().as_ref(), event_id.as_ref()],
        bump
    )]
    pub action_receipt: Account<'info, ActionReceipt>,
    /// CHECK: Identity only; PDA uses this key in seeds.
    pub user: UncheckedAccount<'info>,
    #[account(mut)]
    pub relayer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<ApplyReputationAction>,
    action: ReputationAction,
    event_id: [u8; 32],
    actor: Pubkey,
) -> Result<()> {
    require!(event_id != [0u8; 32], StudyDaoError::InvalidEventId);
    
    // Check if relayer is in the authorized relayers list
    let relayer_key = ctx.accounts.relayer.key();
    require!(
        ctx.accounts.platform.authorized_relayers.contains(&relayer_key),
        StudyDaoError::RelayerNotAuthorized
    );

    let now = Clock::get()?.unix_timestamp;
    let user_key = ctx.accounts.user.key();

    let delta = {
        let platform = &mut ctx.accounts.platform;
        let user_rep = &mut ctx.accounts.user_reputation;

        if user_rep.wallet == Pubkey::default() {
            let next_user_index = platform
                .total_users_count
                .checked_add(1)
                .ok_or(StudyDaoError::MathOverflow)?;
            platform.total_users_count = next_user_index;

            user_rep.wallet = user_key;
            user_rep.bump = ctx.bumps.user_reputation;
            user_rep.registration_index = next_user_index;
            user_rep.reputation_score = 0;
            user_rep.total_notes_uploads = 0;
            user_rep.total_lab_reports_uploads = 0;
            user_rep.total_questions = 0;
            user_rep.total_answers = 0;
            user_rep.total_accepted_answers = 0;
            user_rep.last_claim_ts = now;
            user_rep.last_updated = now;
            user_rep.badge_tier = BadgeTier::Spark;
            user_rep.is_top10 = false;
            user_rep.founding_member_bonus_claimed = false;
            user_rep.current_login_streak_days = 0;
            user_rep.total_actions_processed = 0;
        }

        require_keys_eq!(user_rep.wallet, user_key, StudyDaoError::InvalidUserAccount);

        let delta = points_for_action(user_rep, action)?;
        apply_points_delta(user_rep, delta)?;

        match action {
            ReputationAction::UploadNotes => {
                user_rep.total_notes_uploads = user_rep
                    .total_notes_uploads
                    .checked_add(1)
                    .ok_or(StudyDaoError::MathOverflow)?;
            }
            ReputationAction::UploadLabReports => {
                user_rep.total_lab_reports_uploads = user_rep
                    .total_lab_reports_uploads
                    .checked_add(1)
                    .ok_or(StudyDaoError::MathOverflow)?;
            }
            ReputationAction::QuestionPosted => {
                user_rep.total_questions = user_rep
                    .total_questions
                    .checked_add(1)
                    .ok_or(StudyDaoError::MathOverflow)?;
            }
            ReputationAction::AnswerPosted => {
                user_rep.total_answers = user_rep
                    .total_answers
                    .checked_add(1)
                    .ok_or(StudyDaoError::MathOverflow)?;
            }
            ReputationAction::AnswerMarkedAccepted => {
                user_rep.total_accepted_answers = user_rep
                    .total_accepted_answers
                    .checked_add(1)
                    .ok_or(StudyDaoError::MathOverflow)?;
            }
            ReputationAction::FoundingMemberClaim => {
                user_rep.founding_member_bonus_claimed = true;
            }
            ReputationAction::UploadUpvote
            | ReputationAction::UploadDownvote
            | ReputationAction::QuestionUpvoted
            | ReputationAction::AnswerUpvoted
            | ReputationAction::DailyLoginStreakCompleted => {}
        }

        user_rep.last_claim_ts = now;
        user_rep.last_updated = now;
        user_rep.total_actions_processed = user_rep
            .total_actions_processed
            .checked_add(1)
            .ok_or(StudyDaoError::MathOverflow)?;
        user_rep.badge_tier = derive_badge(user_rep.reputation_score, user_rep.is_top10);

        delta
    };

    if delta > 0 {
        ctx.accounts.platform.total_reputation_distributed = ctx
            .accounts
            .platform
            .total_reputation_distributed
            .checked_add(delta as u64)
            .ok_or(StudyDaoError::MathOverflow)?;
    }
    ctx.accounts.platform.updated_at = now;

    let receipt = &mut ctx.accounts.action_receipt;
    receipt.user = user_key;
    receipt.actor = actor;
    receipt.action = action.as_u8();
    receipt.event_id = event_id;
    receipt.points_delta = delta;
    receipt.timestamp = now;
    receipt.bump = ctx.bumps.action_receipt;

    reimburse_relayer(
        &ctx.accounts.platform,
        &mut ctx.accounts.sol_reserve,
        &ctx.accounts.relayer,
    )?;

    emit!(ReputationActionApplied {
        user: user_key,
        actor,
        relayer: relayer_key,
        points_delta: delta,
        new_score: ctx.accounts.user_reputation.reputation_score,
        action: action.as_u8(),
        event_id,
        fee_lamports: RELAYER_FEE_LAMPORTS,
        timestamp: now,
    });

    Ok(())
}

fn points_for_action(user_rep: &UserReputation, action: ReputationAction) -> Result<i64> {
    match action {
        ReputationAction::UploadNotes => Ok(PTS_UPLOAD_NOTES),
        ReputationAction::UploadLabReports => Ok(PTS_UPLOAD_LAB_REPORTS),
        ReputationAction::UploadUpvote => Ok(PTS_UPLOAD_UPVOTED),
        ReputationAction::UploadDownvote => Ok(PTS_UPLOAD_DOWNVOTED),
        ReputationAction::QuestionPosted => Ok(PTS_POST_QUESTION),
        ReputationAction::QuestionUpvoted => Ok(PTS_QUESTION_UPVOTED),
        ReputationAction::AnswerPosted => Ok(PTS_POST_ANSWER),
        ReputationAction::AnswerUpvoted => Ok(PTS_ANSWER_UPVOTED),
        ReputationAction::AnswerMarkedAccepted => Ok(PTS_ANSWER_ACCEPTED),
        ReputationAction::FoundingMemberClaim => {
            require!(
                user_rep.registration_index > 0
                    && user_rep.registration_index <= FOUNDING_MEMBER_LIMIT,
                StudyDaoError::InvalidFoundingMemberClaim
            );
            require!(
                !user_rep.founding_member_bonus_claimed,
                StudyDaoError::FoundingBonusAlreadyClaimed
            );
            Ok(PTS_FOUNDING_MEMBER)
        }
        ReputationAction::DailyLoginStreakCompleted => {
            Err(error!(StudyDaoError::StreakRewardDisabled))
        }
    }
}

fn apply_points_delta(user_rep: &mut UserReputation, delta: i64) -> Result<()> {
    if delta >= 0 {
        user_rep.reputation_score = user_rep
            .reputation_score
            .checked_add(delta as u64)
            .ok_or(StudyDaoError::MathOverflow)?;
        return Ok(());
    }

    let abs_delta = delta.unsigned_abs();
    user_rep.reputation_score = user_rep.reputation_score.saturating_sub(abs_delta);
    Ok(())
}

pub fn derive_badge(points: u64, is_top10: bool) -> BadgeTier {
    if points >= TIER_5_MIN && is_top10 {
        BadgeTier::Singularity
    } else if points >= TIER_4_MIN {
        BadgeTier::Supernova
    } else if points >= TIER_3_MIN {
        BadgeTier::Core
    } else if points >= TIER_2_MIN {
        BadgeTier::Current
    } else {
        BadgeTier::Spark
    }
}

fn reimburse_relayer<'info>(
    platform: &Account<'info, Platform>,
    sol_reserve: &mut Account<'info, SolReserve>,
    relayer: &Signer<'info>,
) -> Result<()> {
    let sol_reserve_ai = sol_reserve.to_account_info();
    let relayer_ai = relayer.to_account_info();

    let rent_exempt_minimum = Rent::get()?.minimum_balance(8 + SolReserve::LEN);
    let reserve_balance = sol_reserve_ai.lamports();
    let remaining_balance = reserve_balance
        .checked_sub(RELAYER_FEE_LAMPORTS)
        .ok_or(StudyDaoError::VaultDepleted)?;
    require!(
        remaining_balance >= rent_exempt_minimum,
        StudyDaoError::VaultDepleted
    );

    let platform_key = platform.key();
    let reserve_bump = [platform.sol_reserve_bump];
    let signer_seeds: &[&[u8]] = &[SOL_RESERVE_SEED, platform_key.as_ref(), &reserve_bump];

    invoke_signed(
        &system_instruction::transfer(sol_reserve_ai.key, relayer_ai.key, RELAYER_FEE_LAMPORTS),
        &[sol_reserve_ai, relayer_ai],
        &[signer_seeds],
    )?;

    sol_reserve.total_outflow = sol_reserve
        .total_outflow
        .checked_add(RELAYER_FEE_LAMPORTS)
        .ok_or(StudyDaoError::MathOverflow)?;
    sol_reserve.last_withdraw_ts = Clock::get()?.unix_timestamp;

    Ok(())
}
