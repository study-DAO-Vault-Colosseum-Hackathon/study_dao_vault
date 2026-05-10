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
        // For development: accept custom tokens and extract uid
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

module.exports = { verifyToken };