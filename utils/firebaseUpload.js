// src/utils/uploadFirebase.js
import multer from "multer";
import { bucket } from "./firebase.js"; // Correct relative path
import { v4 as uuidv4 } from "uuid";

// Store files temporarily in memory
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/**
 * Upload a file to Firebase Storage
 * @param {Object} file - multer file object
 * @param {string} folder - optional folder name, default "uploads"
 * @returns {string|null} Public URL or null on failure
 */
export const uploadFileToFirebase = async (file, folder = "uploads") => {
  if (!file) {
    console.error("⚠️ No file provided to uploadFileToFirebase");
    return null;
  }

  const filename = `${folder}/${Date.now()}-${uuidv4()}-${file.originalname}`;
  const fileUpload = bucket.file(filename);

  try {
    // Save file buffer to Firebase
    await fileUpload.save(file.buffer, {
      contentType: file.mimetype,
      resumable: false,
    });

    // Make the file public
    await fileUpload.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    console.log(`✅ File uploaded successfully: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error("❌ Failed to upload file to Firebase:", err.message);
    return null;
  }
};