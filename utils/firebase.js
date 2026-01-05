// firebase.js
import admin from "firebase-admin";

// Load Base64 service account from env
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, "base64").toString("utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET, // e.g., "joblink-nigeria.appspot.com"
});

export const bucket = admin.storage().bucket();