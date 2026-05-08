const { Magic } = require('@magic-sdk/admin');

// Initialize Magic Admin SDK
const magic = new Magic(process.env.MAGIC_SECRET_KEY);

/**
 * Verifies a Magic DID token and returns the user's metadata.
 * @param {string} didToken - The DID token from the Authorization header.
 * @returns {Promise<Object>} - User metadata.
 */
async function verifyMagicToken(didToken) {
  try {
    // Validate the token and get user metadata
    const metadata = await magic.users.getMetadataByToken(didToken);
    return metadata;
  } catch (error) {
    throw new Error(`Magic token verification failed: ${error.message}`);
  }
}

/**
 * Returns the public address for a user.
 * For Solana, this should be the Solana public key.
 * @param {string} didToken - The DID token.
 * @returns {Promise<string>} - Public address.
 */
async function getUserAddress(didToken) {
  const metadata = await verifyMagicToken(didToken);
  return metadata.publicAddress;
}

module.exports = { magic, verifyMagicToken, getUserAddress };
