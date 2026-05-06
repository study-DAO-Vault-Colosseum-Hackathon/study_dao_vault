const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

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
