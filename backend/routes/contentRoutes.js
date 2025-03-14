import express from 'express';
const router = express.Router();
import { getCourseContent, addContent } from '../controllers/contentController.js';
import { protect, instructor } from '../middleware/authMiddleware.js'
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/:id').get(protect, checkObjectId, getCourseContent).post(protect, instructor, addContent, checkObjectId);
export default router;