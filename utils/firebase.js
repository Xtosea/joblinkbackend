// src/utils/firebase.js
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

/**
 * 🔥 Firebase Base64 Service Account Loader
 * - Uses FIREBASE_SERVICE_ACCOUNT_BASE64
 * - Safe for Render environment variables
 */
if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT_BASE64 is missing!");
  process.exit(1);
}

let serviceAccount;

try {
  // Decode Base64 to JSON
  const decoded = Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
    "base64"
  ).toString("utf-8");

  serviceAccount = JSON.parse(decoded);
} catch (err) {
  console.error("❌ Failed to decode or parse Firebase service account JSON");
  console.error(err.message);
  process.exit(1);
}

// Check for bucket name
if (!process.env.FIREBASE_BUCKET) {
  console.error("❌ FIREBASE_BUCKET env variable is missing!");
  process.exit(1);
}

// Initialize Firebase Admin
try {
  initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_BUCKET,
  });

  console.log("✅ Firebase initialized successfully");
} catch (err) {
  console.error("❌ Firebase initialization failed");
  console.error(err.message);
  process.exit(1);
}

// Export the storage bucket instance for uploads
export const bucket = getStorage().bucket();