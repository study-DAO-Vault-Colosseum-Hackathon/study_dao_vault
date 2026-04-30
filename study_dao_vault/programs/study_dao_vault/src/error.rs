use anchor_lang::prelude::*;

#[error_code]
pub enum StudyDaoError {
    #[msg("Only the platform authority can perform this action.")]
    Unauthorized,
    #[msg("Amount must be greater than zero.")]
    InvalidAmount,
    #[msg("Reputation points are outside allowed limits.")]
    InvalidPoints,
    #[msg("User reputation account does not match signer.")]
    InvalidUserAccount,
    #[msg("Vault balance is too low to reimburse relayer.")]
    VaultDepleted,
    #[msg("Arithmetic overflow.")]
    MathOverflow,
}
