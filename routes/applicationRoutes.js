// routes/applicationRoutes.js
import express from 'express';
import multer from 'multer';
import {
  createApplication,
  uploadFiles,
  getApplications,
  replyToApplication
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Routes
router.post('/', createApplication); // step 1: create application
router.post('/upload/:id', upload.fields([
  { name: 'proofFile' }, 
  { name: 'resumeFile' }
]), uploadFiles); // step 2: upload files
router.get('/', protect, getApplications);
router.post('/reply/:id', protect, replyToApplication);

export default router;