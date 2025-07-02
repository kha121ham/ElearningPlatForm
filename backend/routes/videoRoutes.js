import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, allowedToUpload } from '../middleware/authMiddleware.js';

const router = express.Router();

// Set up storage for uploaded videos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'videos/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
});

// File filter to allow only video files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/mkv', 'video/avi'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only video files are allowed.'));
    }
};

// Multer middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, 
});

// Route to upload a video
router.post('/upload', protect, allowedToUpload, upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
    }
    res.status(200).json({ message: 'Video uploaded successfully', videoPath: `/videos/${req.file.filename}` });
});

export default router;