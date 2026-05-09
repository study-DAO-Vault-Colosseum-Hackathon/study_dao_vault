// routes/auth.js
const express = require('express');
const { authenticateMagic } = require('../middleware/magic-auth');
const { db } = require('../utils/firebase');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')
const { listAllUsers , getUserById, updateUser, deleteUser} = require('../controlller/userController');
const { makeadmin, makeAdmin } = require('../controlller/adminController');
const { isAdmin } = require('../middleware/auth');
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

// Middleware: Check if user is admin
const checkAdminAccess = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    console.log('Admin check - userId:', userId);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user ID provided' });
    }

    // For development, allow requests to pass through
    // In production, verify against Firestore admin collection
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Bypassing strict admin check');
    }
    
    req.adminId = userId;
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Route 4: get Data of all Users and their details as well :GET "/api/auth/getallUser" (For Admin Only)

const getAllUsers = async (req, res) => {
  try {
    const usersCollection = db.collection('users');
    const snapshot = await usersCollection.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No users found' });
    }

    const usersList = [];
    snapshot.forEach(doc => {
      // doc.id is the UID, doc.data() is the name, email, userType, etc.
      usersList.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(usersList);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/auth/admin/users - Get all users (Admin only)
router.get('/admin/users', checkAdminAccess, async (req, res) => {
  try {
    console.log('Fetching all users from Firestore');
    const usersCollection = db.collection('users');
    const snapshot = await usersCollection.get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const usersList = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      usersList.push({ 
        _id: doc.id, 
        uid: doc.id,
        id: doc.id,
        displayName: data.displayName || data.username || 'Unknown',
        email: data.email || 'N/A',
        walletAddress: data.walletAddress || data.magicId || 'N/A',
        walletPoints: data.walletPoints || 0,
        role: data.role || 'student',
        banned: data.banned || false,
        deleted: data.deleted || false,
        createdAt: data.createdAt || 'N/A',
        ...data
      });
    });

    console.log(`Found ${usersList.length} users`);
    res.status(200).json(usersList);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/admin/user/:id - Get specific user by ID (Admin only)
router.get('/admin/user/:id', checkAdminAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await db.collection('users').doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ _id: id, uid: id, ...userDoc.data() });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/auth/admin/user/:id - Update user (Admin only)
router.patch('/admin/user/:id', checkAdminAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent direct role changes through this endpoint
    delete updates.role;
    delete updates.id;
    delete updates._id;

    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    updates.updatedAt = new Date();
    updates.updatedBy = req.adminId;

    await db.collection('users').doc(id).update(updates);

    const updatedDoc = await db.collection('users').doc(id).get();
    res.status(200).json({ 
      success: true, 
      message: 'User updated successfully',
      user: { _id: id, uid: id, ...updatedDoc.data() } 
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/auth/admin/user/:id - Delete user (Admin only)
router.delete('/admin/user/:id', checkAdminAccess, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.adminId) {
      return res.status(400).json({ error: 'Cannot delete your own admin account' });
    }

    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Soft delete - mark as deleted instead of removing
    await db.collection('users').doc(id).update({
      deleted: true,
      deletedAt: new Date(),
      deletedBy: req.adminId
    });

    res.status(200).json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/auth/admin/user/:id/ban - Ban/Unban user (Admin only)
router.patch('/admin/user/:id/ban', checkAdminAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const { ban, reason } = req.body;

    if (typeof ban !== 'boolean') {
      return res.status(400).json({ error: 'Ban must be a boolean' });
    }

    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = {
      banned: ban,
      banReason: ban ? reason : null,
      bannedAt: ban ? new Date() : null,
      bannedBy: ban ? req.adminId : null,
      updatedAt: new Date()
    };

    await db.collection('users').doc(id).update(updates);

    const updatedDoc = await db.collection('users').doc(id).get();
    res.status(200).json({ 
      success: true, 
      message: ban ? 'User banned successfully' : 'User unbanned successfully',
      user: { _id: id, uid: id, ...updatedDoc.data() } 
    });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/auth/admin/user/:id/points - Update wallet points (Admin only)
router.patch('/admin/user/:id/points', checkAdminAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const { points, action } = req.body; // action: 'set', 'add', 'subtract'

    if (typeof points !== 'number' || points < 0) {
      return res.status(400).json({ error: 'Points must be a non-negative number' });
    }

    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentPoints = userDoc.data().walletPoints || 0;
    let newPoints = points;

    if (action === 'add') {
      newPoints = currentPoints + points;
    } else if (action === 'subtract') {
      newPoints = Math.max(0, currentPoints - points);
    }

    const updates = {
      walletPoints: newPoints,
      updatedAt: new Date(),
      updatedBy: req.adminId
    };

    await db.collection('users').doc(id).update(updates);

    const updatedDoc = await db.collection('users').doc(id).get();
    res.status(200).json({ 
      success: true, 
      message: 'Wallet points updated successfully',
      user: { _id: id, uid: id, ...updatedDoc.data() } 
    });
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/auth/admin/user/:id/role - Update user role (Admin only)
router.patch('/admin/user/:id/role', checkAdminAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['student', 'mentor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Role must be one of: ${validRoles.join(', ')}` });
    }

    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = {
      role: role,
      updatedAt: new Date(),
      updatedBy: req.adminId
    };

    await db.collection('users').doc(id).update(updates);

    const updatedDoc = await db.collection('users').doc(id).get();
    res.status(200).json({ 
      success: true, 
      message: 'User role updated successfully',
      user: { _id: id, uid: id, ...updatedDoc.data() } 
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/getalluser1test', getAllUsers);
router.get('/getalluser', listAllUsers);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser)
router.get('/:id', getUserById);

// admin access
router.patch('/make-admin/:id' , makeAdmin)
module.exports = router;
// const express = require('express');
// const { verifyToken } = require('../middleware/auth');
// const { db } = require('../utils/firebase');

// const router = express.Router();

// /**
//  * GET /api/auth/check-user
//  * Check if current user exists in Firestore
//  * Returns: { isFirstTime: boolean, user: {...} or null }
//  */
// router.get('/check-user', verifyToken, async (req, res) => {
//   try {
//     const uid = req.user.uid;
//     const userDoc = await db.collection('users').doc(uid).get();

//     if (userDoc.exists) {
//       // User exists, return their data
//       return res.json({
//         isFirstTime: false,
//         user: {
//           uid,
//           ...userDoc.data()
//         }
//       });
//     } else {
//       // User doesn't exist, this is their first time
//       return res.json({
//         isFirstTime: true,
//         user: null
//       });
//     }
//   } catch (error) {
//     console.error('Error checking user:', error);
//     return res.status(500).json({
//       error: 'Failed to check user status',
//       message: error.message
//     });
//   }
// });

// /**
//  * POST /api/auth/create-user
//  * Create a new user record with display name
//  * Body: { displayName: string }
//  * Returns: { success: boolean, user: {...} }
//  */
// router.post('/create-user', verifyToken, async (req, res) => {
//   try {
//     const uid = req.user.uid;
//     const { displayName } = req.body;

//     // Validate display name
//     if (!displayName || typeof displayName !== 'string') {
//       return res.status(400).json({
//         error: 'Invalid display name',
//         message: 'Display name is required'
//       });
//     }

//     // Validate format: letters, numbers, underscores only, 3-24 chars
//     const isValid = /^[a-zA-Z0-9_]{3,24}$/.test(displayName);
//     if (!isValid) {
//       return res.status(400).json({
//         error: 'Invalid display name format',
//         message: 'Display name must be 3-24 characters and contain only letters, numbers, and underscores'
//       });
//     }

//     // Create user document
//     const userData = {
//       uid,
//       email: req.user.email || '',
//       displayName: displayName.trim(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       authProvider: req.user.firebase?.sign_in_provider || 'unknown'
//     };

//     await db.collection('users').doc(uid).set(userData);

//     return res.json({
//       success: true,
//       user: userData
//     });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return res.status(500).json({
//       error: 'Failed to create user account',
//       message: error.message
//     });
//   }
// });

// /**
//  * POST /api/auth/update-user
//  * Update user profile (display name or other fields)
//  * Body: { displayName?: string, ... other fields }
//  * Returns: { success: boolean, user: {...} }
//  */
// router.post('/update-user', verifyToken, async (req, res) => {
//   try {
//     const uid = req.user.uid;
//     const updates = req.body;

//     // Validate display name if provided
//     if (updates.displayName) {
//       const isValid = /^[a-zA-Z0-9_]{3,24}$/.test(updates.displayName);
//       if (!isValid) {
//         return res.status(400).json({
//           error: 'Invalid display name format',
//           message: 'Display name must be 3-24 characters and contain only letters, numbers, and underscores'
//         });
//       }
//     }

//     // Add updated timestamp
//     updates.updatedAt = new Date().toISOString();

//     // Update user document
//     await db.collection('users').doc(uid).update(updates);

//     // Get updated document
//     const updatedDoc = await db.collection('users').doc(uid).get();

//     return res.json({
//       success: true,
//       user: {
//         uid,
//         ...updatedDoc.data()
//       }
//     });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     return res.status(500).json({
//       error: 'Failed to update user profile',
//       message: error.message
//     });
//   }
// });

// module.exports = router;
