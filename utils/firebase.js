import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT_BASE64 is missing");
  process.exit(1);
}

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf-8")
);

initializeApp({
  credential: cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
  }),
  storageBucket: process.env.FIREBASE_BUCKET,
});

export const bucket = getStorage().bucket();