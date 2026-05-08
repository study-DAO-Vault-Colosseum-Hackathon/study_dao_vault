const { verifyMagicToken } = require('../src/magic');

/**
 * Middleware to authenticate requests using Magic Link DID tokens.
 * Extracts the token from the Bearer Authorization header.
 */
async function authenticateMagic(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid authorization header' 
      });
    }

    const didToken = authHeader.split(' ')[1];
    
    // Verify token and get metadata
    const metadata = await verifyMagicToken(didToken);

    // Attach user info to request object
    // We map 'publicAddress' to 'walletAddress' to maintain compatibility with existing logic
    req.user = {
      userId: metadata.issuer, // Unique identifier from Magic (did:ethr:...)
      email: metadata.email,
      walletAddress: metadata.publicAddress,
      metadata: metadata,
    };

    next();
  } catch (error) {
    console.error('Magic auth error:', error.message);
    res.status(401).json({ error: error.message });
  }
}

module.exports = { authenticateMagic };
