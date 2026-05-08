// src/services/authService.js
const { auth } = require('../utils/firebase');

class AuthService {
  async getAuthUser(uid) {
    // Fetches the system-level user record
    const userRecord = await auth.getUser(uid);
    return userRecord;
  }

  async fetchAllUsers() {
        const users = await userRepository.getAllUsers();
        
        // We map the array and remove sensitive fields.
        return users.map(({ password, ...userProfile }) => userProfile);
    }
}
module.exports = new AuthService();