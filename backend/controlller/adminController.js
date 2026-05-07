const { auth } = require('../utils/firebase');

const makeAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    // This sets a permanent "admin" flag on the user's Firebase Auth account
    await auth.setCustomUserClaims(id, { admin: true });
    
    res.status(200).json({ message: `User ${id} is now an Admin.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {makeAdmin}