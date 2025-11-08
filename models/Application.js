import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  jobType: { type: String, enum: ['Full-time', 'Part-time'], required: true },
  jobPosition: { type: String, required: true },
  proofFile: { type: String },
  resumeFile: { type: String },
  reply: { type: String, default: '' },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Application', applicationSchema);