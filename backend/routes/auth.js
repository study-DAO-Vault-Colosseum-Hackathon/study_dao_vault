// routes/auth.js
const express = require('express');
const { authenticateMagic } = require('../middleware/magic-auth');
const { db } = require('../utils/firebase');

const router = express.Router();

// POST /api/auth/verify-user
// Creates user record in Firestore if first time, returns user data
router.post('/verify-user', authenticateMagic, async (req, res) => {
  try {
    // Magic ID and email are extracted from the DID token in middleware
    const { userId, walletAddress, email } = req.user;

    // Check if user exists in Firestore
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      // Existing user
      return res.json({
        userId,
        hasUsername: !!userSnap.data().username,
        email: userSnap.data().email,
      });
    }

    // First time - create user record
    await userRef.set({
      magicId: userId,
      email,
      walletAddress,
      username: null, // Will be set when user creates it
      createdAt: new Date(),
      lastLogin: new Date(),
    });

    res.json({
      userId,
      hasUsername: false,
      email,
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/set-username
// Called after user creates username on first login
router.post('/set-username', authenticateMagic, async (req, res) => {
  try {
    const { username } = req.body;
    const { userId } = req.user;

    // Validate username
    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    // Check if username is unique
    const existing = await db.collection('users')
      .where('username', '==', username.toLowerCase())
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Update user with username
    await db.collection('users').doc(userId).update({
      username: username.toLowerCase(),
      usernameUpdatedAt: new Date(),
    });

    res.json({ success: true, username });
  } catch (error) {
    console.error('Set username error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;