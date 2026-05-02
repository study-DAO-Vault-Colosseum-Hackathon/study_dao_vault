use anchor_lang::prelude::*;
use crate::{error::StudyDaoError, state::Platform, constants::PLATFORM_SEED, events::RelayerAdded};

#[derive(Accounts)]
pub struct AddRelayer<'info> {
    #[account(
        mut,
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        has_one = authority @ StudyDaoError::Unauthorized
    )]
    pub platform: Account<'info, Platform>,
    pub authority: Signer<'info>,
}

/// Maximum number of authorized relayers allowed.
pub const MAX_AUTHORIZED_RELAYERS: usize = 20;

pub fn handler(ctx: Context<AddRelayer>, relayer_pubkey: Pubkey) -> Result<()> {
    let platform = &mut ctx.accounts.platform;

    // Prevent adding the same relayer twice
    require!(
        !platform.authorized_relayers.contains(&relayer_pubkey),
        StudyDaoError::RelayerAlreadyAuthorized
    );

    // Prevent exceeding max relayers
    require!(
        platform.authorized_relayers.len() < MAX_AUTHORIZED_RELAYERS,
        StudyDaoError::MaxRelayersExceeded
    );

    platform.authorized_relayers.push(relayer_pubkey);

    // Emit event for indexing
    emit!(RelayerAdded {
        relayer: relayer_pubkey,
        added_at: Clock::get()?.unix_timestamp,
    });

    Ok(())
}