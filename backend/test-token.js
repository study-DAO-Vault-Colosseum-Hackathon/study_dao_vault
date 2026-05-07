const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const db = admin.firestore();

const userRef = db.collection('users');

const createUserObject = (data) => {
  return {
    name: data.name,
    email: data.email,
    password: data.password, 
    date: admin.firestore.FieldValue.serverTimestamp() // Best practice for dates
  };
};

module.exports = { userRef, createUserObject };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function getTestToken() {
  try {
    // Create a custom token for testing
    const uid = 'test-user-456'; // Different user for testing downvote
    const token = await admin.auth().createCustomToken(uid);
    console.log('Test Token:');
    console.log(token);
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit();
}

getTestToken();
