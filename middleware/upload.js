import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

console.log("UPLOAD ID:", req.params.id);
console.log("FILES:", req.files);