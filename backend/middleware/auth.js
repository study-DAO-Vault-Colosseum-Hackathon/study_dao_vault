const { authenticateMagic } = require('./magic-auth');

// Export Magic authenticator as default auth middleware
module.exports = { verifyToken: authenticateMagic };
