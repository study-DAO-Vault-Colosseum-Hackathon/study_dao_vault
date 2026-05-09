use anchor_lang::prelude::*;

use crate::{constants::*, state::*};

#[derive(Accounts)]
pub struct InitPlatform<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Platform::len_with_relayers(10),
        seeds = [PLATFORM_SEED],
        bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(
        init,
        payer = authority,
        space = 8 + SolReserve::LEN,
        seeds = [SOL_RESERVE_SEED, platform.key().as_ref()],
        bump
    )]
    pub sol_reserve: Account<'info, SolReserve>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitPlatform>) -> Result<()> {
    let now = Clock::get()?.unix_timestamp;

    let platform = &mut ctx.accounts.platform;
    platform.authority = ctx.accounts.authority.key();
    platform.bump = ctx.bumps.platform;
    platform.sol_reserve_bump = ctx.bumps.sol_reserve;
    platform.total_users_count = 0;
    platform.total_reputation_distributed = 0;
    platform.created_at = now;
    platform.updated_at = now;
    // Initialize authorized relayers with the authority as the first relayer
    platform.authorized_relayers = vec![ctx.accounts.authority.key()];

    let sol_reserve = &mut ctx.accounts.sol_reserve;
    sol_reserve.platform = platform.key();
    sol_reserve.bump = ctx.bumps.sol_reserve;
    sol_reserve.total_inflow = 0;
    sol_reserve.total_outflow = 0;
    sol_reserve.created_at = now;
    sol_reserve.last_withdraw_ts = now;

    Ok(())
}
