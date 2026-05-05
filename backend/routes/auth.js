const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { db } = require('../utils/firebase');

const router = express.Router();

/**
 * GET /api/auth/check-user
 * Check if current user exists in Firestore
 * Returns: { isFirstTime: boolean, user: {...} or null }
 */
router.get('/check-user', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection('users').doc(uid).get();

    if (userDoc.exists) {
      // User exists, return their data
      return res.json({
        isFirstTime: false,
        user: {
          uid,
          ...userDoc.data()
        }
      });
    } else {
      // User doesn't exist, this is their first time
      return res.json({
        isFirstTime: true,
        user: null
      });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    return res.status(500).json({
      error: 'Failed to check user status',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/create-user
 * Create a new user record with display name
 * Body: { displayName: string }
 * Returns: { success: boolean, user: {...} }
 */
router.post('/create-user', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { displayName } = req.body;

    // Validate display name
    if (!displayName || typeof displayName !== 'string') {
      return res.status(400).json({
        error: 'Invalid display name',
        message: 'Display name is required'
      });
    }

    // Validate format: letters, numbers, underscores only, 3-24 chars
    const isValid = /^[a-zA-Z0-9_]{3,24}$/.test(displayName);
    if (!isValid) {
      return res.status(400).json({
        error: 'Invalid display name format',
        message: 'Display name must be 3-24 characters and contain only letters, numbers, and underscores'
      });
    }

    // Create user document
    const userData = {
      uid,
      email: req.user.email || '',
      displayName: displayName.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authProvider: req.user.firebase?.sign_in_provider || 'unknown'
    };

    await db.collection('users').doc(uid).set(userData);

    return res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      error: 'Failed to create user account',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/update-user
 * Update user profile (display name or other fields)
 * Body: { displayName?: string, ... other fields }
 * Returns: { success: boolean, user: {...} }
 */
router.post('/update-user', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const updates = req.body;

    // Validate display name if provided
    if (updates.displayName) {
      const isValid = /^[a-zA-Z0-9_]{3,24}$/.test(updates.displayName);
      if (!isValid) {
        return res.status(400).json({
          error: 'Invalid display name format',
          message: 'Display name must be 3-24 characters and contain only letters, numbers, and underscores'
        });
      }
    }

    // Add updated timestamp
    updates.updatedAt = new Date().toISOString();

    // Update user document
    await db.collection('users').doc(uid).update(updates);

    // Get updated document
    const updatedDoc = await db.collection('users').doc(uid).get();

    return res.json({
      success: true,
      user: {
        uid,
        ...updatedDoc.data()
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      error: 'Failed to update user profile',
      message: error.message
    });
  }
});

module.exports = router;
