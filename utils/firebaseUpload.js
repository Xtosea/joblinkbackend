import multer from "multer";
import { bucket } from "./firebase.js";
import { v4 as uuidv4 } from "uuid";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadFileToFirebase = async (file, folder = "uploads") => {
  if (!file) {
    console.error("⚠️ No file provided to uploadFileToFirebase");
    return null;
  }

  const filename = `${folder}/${Date.now()}-${uuidv4()}-${file.originalname}`;
  const fileUpload = bucket.file(filename);

  try {
    await fileUpload.save(file.buffer, { contentType: file.mimetype, resumable: false });
    await fileUpload.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    console.log(`✅ File uploaded successfully: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error("❌ Failed to upload file to Firebase:", err.message);
    return null;
  }
};