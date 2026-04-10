const { auth } = require("../utils/firebase");

const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = { verifyToken };