import express from 'express';
const router = express.Router();
import {
    getCourses,
    getCourseById,
    createCourse,
    createCourseReview,
    getTopCourses
} from '../controllers/courseController.js';
import { protect, instractor } from '../middleware/authMiddleware.js'
import checkObjectId from '../middleware/checkObjectId.js';


router.route('/').get(getCourses).post(protect, instractor, createCourse);
router.route('/top').get(getTopCourses);
router.route('/:id').get(getCourseById,checkObjectId);
router.route('/:id/reviews').post(protect, checkObjectId, createCourseReview);

export default router;