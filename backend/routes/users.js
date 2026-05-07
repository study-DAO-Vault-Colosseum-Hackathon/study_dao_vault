const express = require('express');
const { verifyToken } = require('../middleware/auth');
const userRepository = require('../repositories/userRepository');

const router = express.Router();

/**
 * GET /api/users
 * Fetch all users (Protected - requires Firebase token)
 * Response: { success: boolean, data: Array, message: string }
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();

    // Filter out sensitive information
    const sanitizedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Add other safe fields as needed
      // Exclude: password, firebaseUID, apiKeys, etc.
    }));

    res.json({
      success: true,
      data: sanitizedUsers,
      count: sanitizedUsers.length,
      message: 'Users fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
});

/**
 * GET /api/users/search/email
 * Search users by email (Protected - requires Firebase token)
 * Query: ?email=user@example.com
 * Response: { success: boolean, data: Array, message: string }
 */
router.get('/search/email', verifyToken, async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email query parameter is required',
      });
    }

    const users = await userRepository.searchUsersByEmail(email);

    const sanitizedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }));

    res.json({
      success: true,
      data: sanitizedUsers,
      message: 'Users found',
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message,
    });
  }
});

/**
 * GET /api/users/:userId
 * Fetch a single user by ID (Protected - requires Firebase token)
 * Response: { success: boolean, data: Object, message: string }
 */
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const user = await userRepository.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Sanitize user data
    const sanitizedUser = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      success: true,
      data: sanitizedUser,
      message: 'User fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
});

/**
 * POST /api/users
 * Create or update user profile (Protected - requires Firebase token)
 * Body: { email, displayName, photoURL, ... }
 * Response: { success: boolean, data: Object, message: string }
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userData = req.body;

    // Validate required fields
    if (!userData.email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Ensure email matches authenticated user (prevent spoofing)
    if (userData.email !== req.user.email && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Email mismatch',
      });
    }

    const user = await userRepository.createOrUpdateUser(userId, userData);

    res.json({
      success: true,
      data: user,
      message: 'User created/updated successfully',
    });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create/update user',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/users/:userId
 * Delete user profile (Protected - requires Firebase token)
 * Response: { success: boolean, message: string }
 */
router.delete('/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.uid;

    // Users can only delete their own profile (unless admin)
    if (userId !== currentUserId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own profile',
      });
    }

    await userRepository.deleteUser(userId);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
});

module.exports = router;
