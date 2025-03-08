import express from 'express';
const router = express.Router();
import {
    getCourses,
    getCourseById,
    createCourse
} from '../controllers/courseController.js';
import { protect, instractor } from '../middleware/authMiddleware.js'
import checkObjectId from '../middleware/checkObjectId.js';


router.route('/').get(getCourses).post(protect, instractor, createCourse);
router.route('/:id').get(getCourseById,checkObjectId);

export default router;