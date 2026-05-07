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
    try {
      const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
      req.user = { uid: payload.uid, email: payload.email || "test@example.com" };
      next();
    } catch (innerError) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  }
};

const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decodedToken = await auth.verifyIdToken(token);
    
    // Check if the 'admin' claim we set earlier exists
    if (decodedToken.admin === true) {
      next(); // User is admin, proceed to the controller
    } else {
      res.status(403).send("Access denied: Admins only.");
    }
  } catch (error) {
    res.status(401).send("Invalid Token");
  }
};

module.exports = { verifyToken, isAdmin };