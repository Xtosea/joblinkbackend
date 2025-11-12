// src/utils/firebase.js
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// Parse the service account JSON stored as a Render secret
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin
initializeApp({
  credential: cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"), // Fix newline characters
  }),
  storageBucket: process.env.FIREBASE_BUCKET, // e.g. "joblink-nigeria.appspot.com"
});

// Export the storage bucket instance
export const bucket = getStorage().bucket();