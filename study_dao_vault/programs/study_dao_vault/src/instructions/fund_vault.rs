use anchor_lang::{prelude::*, system_program};

use crate::{constants::*, error::StudyDaoError, state::*};

#[derive(Accounts)]
pub struct FundVault<'info> {
    #[account(
        mut,
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        has_one = authority @ StudyDaoError::Unauthorized
    )]
    pub platform: Account<'info, Platform>,
    #[account(
        mut,
        seeds = [SOL_RESERVE_SEED, platform.key().as_ref()],
        bump = platform.sol_reserve_bump
    )]
    pub sol_reserve: Account<'info, SolReserve>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<FundVault>, amount: u64) -> Result<()> {
    require!(amount > 0, StudyDaoError::InvalidAmount);

    let transfer_ctx = CpiContext::new(
        ctx.accounts.system_program.key(),
        system_program::Transfer {
            from: ctx.accounts.authority.to_account_info(),
            to: ctx.accounts.sol_reserve.to_account_info(),
        },
    );
    system_program::transfer(transfer_ctx, amount)?;

    let now = Clock::get()?.unix_timestamp;
    let sol_reserve = &mut ctx.accounts.sol_reserve;
    sol_reserve.total_inflow = sol_reserve
        .total_inflow
        .checked_add(amount)
        .ok_or(StudyDaoError::MathOverflow)?;
    ctx.accounts.platform.updated_at = now;

    Ok(())
}
