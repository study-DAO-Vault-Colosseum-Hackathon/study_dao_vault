use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ReputationAction{
    UploadNotes,
    AnswerPosted,
    AnswerUpvoted,
    QuestionUpvoted,
    ManualAdjustment,
}

impl ReputationAction {
    pub fn as_u8(self) -> u8 {
        match self{
            Self::UploadNotes => 0,
            Self::AnswerPosted => 1,
            Self::AnswerUpvoted => 2,
            Self::QuestionUpvoted => 3,
            Self::ManualAdjustment => 4,
        }
    }
}

#[account]
pub struct Platform {
    pub authority: Pubkey,
    pub bump: u8,
    pub sol_reserve_bump: u8,
    pub total_users_count: u64,
    pub total_reputation_distributed: u64,
    pub created_at: i64,
    pub updated_at: i64,
}

impl Platform {
    pub const LEN: usize = 32 + 1 + 1 + 8 + 8 + 8 + 8;
}

#[account]
pub struct SolReserve {
    pub platform: Pubkey,
    pub bump: u8,
    pub total_inflow: u64,
    pub total_outflow: u64,
    pub created_at: i64,
    pub last_withdraw_ts: i64,
}

impl SolReserve {
    pub const LEN: usize = 32 + 1 + 8 + 8 + 8 + 8;
}

#[account]
pub struct UserReputation {
    pub wallet: Pubkey,
    pub bump: u8,
    pub reputation_score: u64,
    pub total_uploads: u32,
    pub total_answers: u32,
    pub last_claim_ts: i64,
    pub last_updated: i64,
}

impl UserReputation {
    pub const LEN: usize = 32 + 1 + 8 + 4 + 4 + 8 + 8;
}