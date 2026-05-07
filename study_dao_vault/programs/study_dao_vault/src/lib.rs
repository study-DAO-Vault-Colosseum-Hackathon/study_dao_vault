pub mod constants;
pub mod error;
pub mod events;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("2AknVcScKtfx9EE7mJ8zPohT1XEdP93c7HoqgCHpbHtu");

#[program]
pub mod study_dao_vault {
    use super::*;

    pub fn init_platform(ctx: Context<InitPlatform>) -> Result<()> {
        instructions::init_platform::handler(ctx)
    }

    pub fn fund_vault(ctx: Context<FundVault>, amount: u64) -> Result<()> {
        instructions::fund_vault::handler(ctx, amount)
    }

    pub fn add_relayer(ctx: Context<AddRelayer>, relayer_pubkey: Pubkey) -> Result<()> {
        instructions::add_relayer::handler(ctx, relayer_pubkey)
    }

    pub fn apply_reputation_action(
        ctx: Context<ApplyReputationAction>,
        action: ReputationAction,
        event_id: [u8; 32],
        actor: Pubkey,
    ) -> Result<()> {
        instructions::apply_reputation_action::handler(ctx, action, event_id, actor)
    }

    pub fn set_top10_status(ctx: Context<SetTop10Status>, is_top10: bool) -> Result<()> {
        instructions::set_top10_status::handler(ctx, is_top10)
    }
}
