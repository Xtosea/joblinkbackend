import fs from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// ---------- Load Firebase credentials ----------
let serviceAccount;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf-8")
    );
    console.log("✅ Loaded Firebase credentials from Base64 env var");
  } else if (fs.existsSync("/etc/secrets/firebase-service-account.json")) {
    const fileContent = fs.readFileSync("/etc/secrets/firebase-service-account.json", "utf-8");
    serviceAccount = JSON.parse(fileContent);
    console.log("✅ Loaded Firebase credentials from Secret File");
  } else {
    console.error("❌ FIREBASE credentials not found. Set Base64 env var or Secret File!");
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Failed to parse Firebase credentials:", err.message);
  process.exit(1);
}

// ---------- Initialize Firebase ----------
if (!process.env.FIREBASE_BUCKET) {
  console.error("❌ FIREBASE_BUCKET env variable is missing");
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

export const bucket = getStorage().bucket();
console.log("✅ Firebase initialized successfully");