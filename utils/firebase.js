// src/utils/firebase.js
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
const bucketName = process.env.FIREBASE_BUCKET;

if (!serviceAccountBase64 || !bucketName) {
  throw new Error("Missing Firebase env variables");
}

const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
);

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: bucketName,
});

export const bucket = getStorage().bucket();