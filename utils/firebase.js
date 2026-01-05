// src/utils/firebase.js
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT_BASE64 is missing");
  process.exit(1);
}

let serviceAccount;
try {
  const decoded = Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
    "base64"
  ).toString("utf-8");

  serviceAccount = JSON.parse(decoded);
} catch (err) {
  console.error("❌ Failed to decode Firebase service account");
  console.error(err.message);
  process.exit(1);
}

// Initialize Firebase Admin
initializeApp({
  credential: cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
  }),
  storageBucket: process.env.FIREBASE_BUCKET,
});

export const bucket = getStorage().bucket();