import express from 'express';
const router = express.Router();
import { getCourseContent, addContent } from '../controllers/contentController.js';
import { protect, instractor } from '../middleware/authMiddleware.js'
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/:id').get(protect, checkObjectId, getCourseContent).post(protect, instractor, addContent, checkObjectId);
export default router;