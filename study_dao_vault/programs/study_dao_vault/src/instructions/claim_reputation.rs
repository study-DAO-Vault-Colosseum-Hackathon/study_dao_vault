use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke_signed, system_instruction},
};

use crate::{
    constants::*,
    error::StudyDaoError,
    events::ReputationClaimed,
    state::{Platform, ReputationAction, SolReserve, UserReputation},
};

#[derive(Accounts)]
pub struct ClaimReputation<'info>{
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
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub relayer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<ClaimReputation>,
    points: u64,
    action: ReputationAction,
) -> Result<()> {
    require!(
        points > 0 && points <= MAX_REPUTATION_POINTS_PER_CLAIM,
        StudyDaoError::InvalidPoints
    );

    let now = Clock::get()?.unix_timestamp;
    let user_key = ctx.accounts.user.key();
    let relayer_key = ctx.accounts.relayer.key();

    let new_score = {
        let user_reputation = &mut ctx.accounts.user_reputation;
        if user_reputation.wallet == Pubkey::default(){
            user_reputation.wallet = user_key;
            user_reputation.bump = ctx.bumps.user_reputation;
            user_reputation.reputation_score = 0;
            user_reputation.total_uploads = 0;
            user_reputation.total_answers = 0;
            user_reputation.last_claim_ts = now;
            user_reputation.last_updated = now;

            ctx.accounts.platform.total_users_count = ctx
                .accounts
                .platform
                .total_users_count
                .checked_add(1)
                .ok_or(StudyDaoError::MathOverflow)?;
        }

        require_keys_eq!(
            user_reputation.wallet,
            user_key,
            StudyDaoError::InvalidUserAccount
        );

        user_reputation.reputation_score = user_reputation
            .reputation_score
            .checked_add(points)
            .ok_or(StudyDaoError::MathOverflow)?;
        user_reputation.last_claim_ts = now;
        user_reputation.last_updated = now;
    
        match action {
            ReputationAction::UploadNotes => {
                user_reputation.total_uploads = user_reputation
                    .total_uploads
                    .checked_add(1)
                    .ok_or(StudyDaoError::MathOverflow)?;
            }
            ReputationAction::AnswerPosted => {
                user_reputation.total_answers = user_reputation
                    .total_answers
                    .checked_add(1)
                    .ok_or(StudyDaoError::MathOverflow)?;
            }
            ReputationAction::AnswerUpvoted 
            | ReputationAction::QuestionUpvoted 
            | ReputationAction::ManualAdjustment => {}
        }

        user_reputation.reputation_score
    };

    ctx.accounts.platform.total_reputation_distributed = ctx
        .accounts
        .platform
        .total_reputation_distributed
        .checked_add(points)
        .ok_or(StudyDaoError::MathOverflow)?;
    ctx.accounts.platform.updated_at = now;

    reimburse_relayer(
        &ctx.accounts.platform,
        &mut ctx.accounts.sol_reserve,
        &ctx.accounts.relayer,
    )?;

    emit!(ReputationClaimed {
        user: user_key,
        relayer: relayer_key,
        points,
        new_score,
        action: action.as_u8(),
        fee_lamports: RELAYER_FEE_LAMPORTS,
        timestamp: now,
    });
    Ok(())
}

fn reimburse_relayer<'info>(
    platform: &Account<'info, Platform>,
    sol_reserve: &mut Account<'info, SolReserve>,
    relayer: &Signer<'info>,
) -> Result<()>{
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
        &system_instruction::transfer(
            sol_reserve_ai.key,
            relayer_ai.key,
            RELAYER_FEE_LAMPORTS,
        ),
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

