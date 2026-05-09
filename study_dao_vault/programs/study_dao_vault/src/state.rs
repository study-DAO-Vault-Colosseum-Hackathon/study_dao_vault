use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq)]
pub enum BadgeTier {
    Spark,
    Current,
    Core,
    Supernova,
    Singularity,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq)]
pub enum ReputationAction {
    UploadNotes,
    UploadLabReports,   
    UploadUpvote,
    UploadDownvote,
    QuestionPosted,
    QuestionUpvoted,
    AnswerPosted,       
    AnswerUpvoted,
    AnswerMarkedAccepted,
    FoundingMemberClaim,
    DailyLoginStreakCompleted,
}

impl ReputationAction {
    pub fn as_u8(self) -> u8 {
        match self {
            Self::UploadNotes => 0,
            Self::UploadLabReports => 1,
            Self::UploadUpvote => 2,
            Self::UploadDownvote => 3,
            Self::QuestionPosted => 4,
            Self::QuestionUpvoted => 5,
            Self::AnswerPosted => 6,
            Self::AnswerUpvoted => 7,
            Self::AnswerMarkedAccepted => 8,
            Self::FoundingMemberClaim => 9,
            Self::DailyLoginStreakCompleted => 10,
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
    pub authorized_relayers: Vec<Pubkey>,
}

impl Platform {
    /// Base LEN without authorized_relayers Vec (which is dynamic).
    /// Dynamic size: 4 bytes for Vec length prefix + (32 bytes per relayer)
    pub const BASE_LEN: usize = 32 + 1 + 1 + 8 + 8 + 8 + 8;
    
    /// Calculate total LEN with relayer capacity.
    pub fn len_with_relayers(capacity: usize) -> usize {
        Self::BASE_LEN + 4 + (32 * capacity) // 4 bytes for Vec prefix + 32 per pubkey
    }
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
    pub registration_index: u64,
    pub reputation_score: u64,
    pub total_notes_uploads: u32,
    pub total_lab_reports_uploads: u32,
    pub total_questions: u32,
    pub total_answers: u32,
    pub total_accepted_answers: u32,
    pub last_claim_ts: i64,
    pub last_updated: i64,
    pub badge_tier: BadgeTier,
    pub is_top10: bool,
    pub founding_member_bonus_claimed: bool,
    pub current_login_streak_days: u16,
    pub total_actions_processed: u64,
}

impl UserReputation {
    pub const LEN: usize = 32 + 1 + 8 + 8 + 4 + 4 + 4 + 4 + 4 + 8 + 8 + 1 + 1 + 1 + 2 + 8;
}

#[account]
pub struct ActionReceipt {
    pub user: Pubkey,
    pub actor: Pubkey,
    pub action: u8,
    pub event_id: [u8; 32],
    pub points_delta: i64,
    pub timestamp: i64,
    pub bump: u8,
}

impl ActionReceipt {
    pub const LEN: usize = 32 + 32 + 1 + 32 + 8 + 8 + 1;
}

