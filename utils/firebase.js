import admin from "firebase-admin";
import fs from "fs";

// Path to Render Secret File
const pathToServiceAccount = "/etc/secrets/firebase-admin.json";

if (!fs.existsSync(pathToServiceAccount)) {
  throw new Error(`Firebase service account file not found at ${pathToServiceAccount}`);
}

// Parse the JSON
const serviceAccount = JSON.parse(fs.readFileSync(pathToServiceAccount, "utf8"));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET, // set this in Render env vars
});

export const bucket = admin.storage().bucket();