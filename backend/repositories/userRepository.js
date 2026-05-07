// src/repositories/userRepository.js
const { db } = require('../utils/firebase');

class UserRepository {
  // Get a single user by ID
  // async getUserById(uid) {
  //   const userDoc = await db.collection('users').doc(uid).get();
  //   if (!userDoc.exists) return null;
  //   return { id: userDoc.id, ...userDoc.data() };
  // }

  // Get all users (useful for Admin dashboards)
 async getAllUsers() {
        try {
            const snapshot = await db.collection('users').get();
            // Map through the documents to return an array of user objects
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw new Error("Could not fetch users from Firestore: " + error.message);
        }
    }
  async findByEmail(email) {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }

  async findByWalletAddress(address) {
    const snapshot = await db.collection('users').where('walletAddress', '==', address).get();
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }

  async createUser(userData) {
    const userRef = await db.collection('users').add({
      ...userData,
      createdAt: new Date().toISOString(),
    });
    return { id: userRef.id, ...userData };
  }

  async getUserById(userId) {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        return null;
      }
      return {
        id: userDoc.id,
        ...userDoc.data(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async createOrUpdateUser(userId, userData) {
    try {
      const userRef = db.collection('users').doc(userId);
      const dataToSave = {
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        dataToSave.createdAt = new Date().toISOString();
      }

      await userRef.set(dataToSave, { merge: true });
      return {
        id: userId,
        ...dataToSave,
      };
    } catch (error) {
      throw new Error(`Failed to create/update user: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    try {
      await db.collection('users').doc(userId).delete();
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async searchUsersByEmail(email) {
    try {
      const snapshot = await db
        .collection('users')
        .where('email', '==', email)
        .get();

      const users = [];
      snapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return users;
    } catch (error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }
}

module.exports = new UserRepository();