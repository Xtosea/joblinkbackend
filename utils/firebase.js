import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { logger } from "./logger.js";

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  logger.error("FIREBASE_SERVICE_ACCOUNT is missing");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (err) {
  logger.error("Invalid FIREBASE_SERVICE_ACCOUNT JSON", {
    error: err.message,
  });
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
  }),
  storageBucket: process.env.FIREBASE_BUCKET,
});

logger.info("Firebase initialized", {
  bucket: process.env.FIREBASE_BUCKET,
});

export const bucket = getStorage().bucket();