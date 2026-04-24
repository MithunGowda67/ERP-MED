const admin = require('firebase-admin');

// Ensure you have FIREBASE_SERVICE_ACCOUNT base64 string or GOOGLE_APPLICATION_CREDENTIALS set in env
// For local development without a key yet, we just initialize default app
// Replace this with your actual config injection
const path = require('path');
const fs = require('fs');

let db;

try {
  let serviceAccount;
  const keyPath = path.resolve(__dirname, '../../../serviceAccountKey.json');
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } else if (fs.existsSync(keyPath)) {
    serviceAccount = require(keyPath);
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'med-erp-342ee'
    });
  } else {
    // Falls back to application default credentials
    admin.initializeApp();
  }
  
  db = admin.firestore();
  console.log('Firebase Admin initialized successfully.');
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

module.exports = { admin, db };
