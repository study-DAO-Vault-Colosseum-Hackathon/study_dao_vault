const { auth } = require('../utils/firebase');

/**
 * Middleware to authenticate requests using Firebase ID tokens.
 * Extracts the token from the Bearer Authorization header.
 * Supports both Firebase and Magic tokens for backward compatibility.
 */
async function authenticateMagic(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid authorization header' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Try Firebase token verification first (default for this app)
    if (auth) {
      try {
        const decodedToken = await auth.verifyIdToken(token);
        
        // Attach user info to request object
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email || null,
          userId: decodedToken.uid,
          metadata: decodedToken,
        };

        return next();
      } catch (firebaseError) {
        // If Firebase verification fails, try Magic token verification
        console.debug('Firebase token verification failed, attempting Magic token verification');
      }
    }

    // Fallback to Magic token verification
    try {
      const { verifyMagicToken } = require('../src/magic');
      const metadata = await verifyMagicToken(token);
      
      req.user = {
        userId: metadata.issuer,
        email: metadata.email,
        walletAddress: metadata.publicAddress,
        metadata: metadata,
      };
      
      return next();
    } catch (magicError) {
      throw new Error('Token verification failed: both Firebase and Magic tokens are invalid');
    }
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ error: error.message });
  }
}

module.exports = { authenticateMagic };
