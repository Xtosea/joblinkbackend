// utils/firebase.js
import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// 🔹 Read environment variables
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
const bucketName = process.env.FIREBASE_BUCKET;

if (!serviceAccountBase64 || !bucketName) {
  throw new Error('Missing Firebase env variables. Make sure FIREBASE_SERVICE_ACCOUNT_BASE64 and FIREBASE_BUCKET are set.');
}

// 🔹 Decode the Base64 service account JSON
let serviceAccount;
try {
  serviceAccount = JSON.parse(
    Buffer.from(serviceAccountBase64, 'base64').toString('utf-8')
  );
} catch (err) {
  throw new Error('Invalid Firebase service account JSON. Make sure it is Base64 encoded correctly.');
}

// 🔹 Initialize Firebase Admin (only once)
let app;
if (!getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: bucketName,
  });
} else {
  app = getApp();
}

// 🔹 Export the storage instance for file uploads
export const bucket = getStorage(app).bucket();