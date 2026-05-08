use anchor_lang::prelude::*;

use crate::{
    constants::*,
    error::StudyDaoError,
    events::Top10StatusUpdated,
    instructions::apply_reputation_action::derive_badge,
    state::{Platform, UserReputation},
};

#[derive(Accounts)]
pub struct SetTop10Status<'info> {
    #[account(
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        has_one = authority @ StudyDaoError::Unauthorized
    )]
    pub platform: Account<'info, Platform>,
    #[account(
        mut,
        seeds = [USER_REPUTATION_SEED, user_reputation.wallet.as_ref()],
        bump = user_reputation.bump
    )]
    pub user_reputation: Account<'info, UserReputation>,
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<SetTop10Status>, is_top10: bool) -> Result<()> {
    let now = Clock::get()?.unix_timestamp;
    let user_rep = &mut ctx.accounts.user_reputation;
    user_rep.is_top10 = is_top10;
    user_rep.badge_tier = derive_badge(user_rep.reputation_score, user_rep.is_top10);
    user_rep.last_updated = now;

    emit!(Top10StatusUpdated {
        user: user_rep.wallet,
        is_top10,
        new_badge_tier: user_rep.badge_tier as u8,
        timestamp: now,
    });

    Ok(())
}
