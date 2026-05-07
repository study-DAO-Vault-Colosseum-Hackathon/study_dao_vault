const { auth } = require('../utils/firebase');

const listAllUsers = async (req, res) => {
  try {
    const listUsersResult = await auth.listUsers(1000); 
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
    }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to get a single user by their UID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameter

    // Fetches a single user record from Firebase Auth using the UID
    const userRecord = await auth.getUser(id);

    const user = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      metadata: userRecord.metadata, // Helpful for seeing "Last Sign In" time
    };

    res.status(200).json(user);
  } catch (error) {
    // If user is not found, Firebase throws a specific error
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const { name, email, password } = req.body;

    const updateData = {};
    if (name) updateData.displayName = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    const updatedUser = await auth.updateUser(id, updateData);

    res.status(200).json({
      message: "User updated successfully",
      user: {
        uid: updatedUser.uid,
        displayName: updatedUser.displayName,
        email: updatedUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await auth.deleteUser(id);
    res.status(200).json({ message: `Successfully deleted user ${id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { listAllUsers , getUserById, updateUser, deleteUser};