// lib/firebaseAdmin.ts
import admin from 'firebase-admin';

const serviceAccount = require('../../../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
