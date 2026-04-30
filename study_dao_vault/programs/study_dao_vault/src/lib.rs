pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub mod events;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("ExY4RXQaD86GyNpofZy9PJV32QKPaDRnzcvByLDb8bTZ");

#[program]
pub mod study_dao_vault {

    use super::*;

    pub fn init_platform(ctx: Context<InitPlatform>) -> Result<()>{
        instructions::init_platform::handler(ctx)
    }

    pub fn fund_vault(ctx: Context<FundVault>, amount: u64)-> Result<()>{
        instructions::fund_vault::handler(ctx, amount)
    }

    pub fn claim_reputation(
        ctx: Context<ClaimReputation>,
        points: u64,
        action: ReputationAction
    ) -> Result<()>{
        instructions::claim_reputation::handler(ctx, points, action)
    }

}