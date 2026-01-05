import multer from "multer";
import { bucket } from "./firebase.js";
import { v4 as uuidv4 } from "uuid";

// Store files in memory (required for Firebase)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Upload file to Firebase Storage
export const uploadFileToFirebase = async (file, folder = "uploads") => {
  if (!file) return null;

  const filename = `${folder}/${Date.now()}-${uuidv4()}-${file.originalname}`;
  const fileUpload = bucket.file(filename);

  await fileUpload.save(file.buffer, {
    contentType: file.mimetype,
    resumable: false,
  });

  await fileUpload.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
};