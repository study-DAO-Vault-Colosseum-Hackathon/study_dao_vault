use anchor_lang::prelude::*;

#[event]
pub struct ReputationActionApplied {
    pub user: Pubkey,
    pub actor: Pubkey,
    pub relayer: Pubkey,
    pub points_delta: i64,
    pub new_score: u64,
    pub action: u8,
    pub event_id: [u8; 32],
    pub fee_lamports: u64,
    pub timestamp: i64,
}

#[event]
pub struct Top10StatusUpdated {
    pub user: Pubkey,
    pub is_top10: bool,
    pub new_badge_tier: u8,
    pub timestamp: i64,
}

#[event]
pub struct RelayerAdded {
    pub relayer: Pubkey,
    pub added_at: i64,
}