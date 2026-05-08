use anchor_lang::prelude::*;

#[error_code]
pub enum StudyDaoError {
    #[msg("Only the platform authority can perform this action.")]
    Unauthorized,
    #[msg("Amount must be greater than zero.")]
    InvalidAmount,
    #[msg("User reputation account does not match signer.")]
    InvalidUserAccount,
    #[msg("Vault balance is too low to reimburse relayer.")]
    VaultDepleted,
    #[msg("Arithmetic overflow.")]
    MathOverflow,
    #[msg("Event ID cannot be zero.")]
    InvalidEventId,
    #[msg("Invalid founding member claim.")]
    InvalidFoundingMemberClaim,
    #[msg("Founding member bonus already claimed.")]
    FoundingBonusAlreadyClaimed,
    #[msg("Daily streak rewards are disabled until streak tracking is implemented.")]
    StreakRewardDisabled,
    #[msg("Relayer is not authorized.")]
    RelayerNotAuthorized,
    #[msg("Relayer is already authorized.")]
    RelayerAlreadyAuthorized,
    #[msg("Maximum authorized relayers reached.")]
    MaxRelayersExceeded,
}
