const admin = require("firebase-admin");

function normalizeBucketName(bucket) {
  if (!bucket) return undefined;
  return bucket.replace(/^gs:\/\//, "").replace(/\/+$/, "");
}

let firebaseInitialized = false;

// Only initialize Firebase if credentials are available
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  };

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: normalizeBucketName(process.env.FIREBASE_STORAGE_BUCKET)
    });
    firebaseInitialized = true;
  } catch (error) {
    console.warn("Firebase initialization failed:", error.message);
  }
} else {
  console.warn("Firebase credentials not found in environment variables. Firebase features will be unavailable.");
}

const auth = firebaseInitialized ? admin.auth() : null;
const db = firebaseInitialized ? admin.firestore() : null;

module.exports = { admin, auth, db, firebaseInitialized };