use anchor_lang::prelude::*;

#[event]
pub struct ReputationClaimed {
    pub user: Pubkey,
    pub relayer: Pubkey,
    pub points: u64,
    pub new_score: u64,
    pub action: u8,
    pub fee_lamports: u64,
    pub timestamp: i64,
}