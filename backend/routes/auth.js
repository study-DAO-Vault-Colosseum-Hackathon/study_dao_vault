const express = require('express');
const { body, validationResult } = require('express-validator');
// const User = require('../models/Users')
const { db } = require('../utils/firebase'); // Import the db from your utils
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')
const { listAllUsers , getUserById, updateUser, deleteUser} = require('../controlller/userController');
const { makeadmin, makeAdmin } = require('../controlller/adminController');
const { isAdmin } = require('../middleware/auth');
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
router.get('/getalluser1test', getAllUsers);
router.get('/getalluser', listAllUsers);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser)
router.get('/:id', getUserById);

// admin access
router.patch('/make-admin/:id' , makeAdmin)
module.exports = router;