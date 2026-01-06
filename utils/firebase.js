import admin from 'firebase-admin';

if (!process.env.FIREBASE_BASE64 || !process.env.FIREBASE_BUCKET) {
  throw new Error('Missing Firebase env variables');
}

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_BASE64, 'base64').toString('utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET,
});

export const bucket = admin.storage().bucket();
export default admin;