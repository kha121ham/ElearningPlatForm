import express from 'express';
const router = express.Router();
import {
    getCourses,
    getCourseById,
    createCourse,
    createCourseReview,
    getTopCourses,
    enrollStudentToCourse,
    getCoursesToAdmin,
    deleteCoursesByAdmin,
    getInstructorCourses,
    deleteInstructorCourse,
    getStudentCourses,
    courseIsPending
} from '../controllers/courseController.js';
import { protect, instructor, admin } from '../middleware/authMiddleware.js'
import checkObjectId from '../middleware/checkObjectId.js';


router.route('/').get(getCourses).post(protect, instructor, createCourse);
router.route('/me').get(protect, getStudentCourses);
router.route('/admin').get(protect , admin, getCoursesToAdmin);
router.route('/:id/admin').delete(protect , admin, deleteCoursesByAdmin);
router.route('/instructor').get(protect , instructor, getInstructorCourses);
router.route('/:id/instructor').delete(protect , instructor, deleteInstructorCourse);
router.route('/top').get(getTopCourses);
router.route('/:id').get(getCourseById,checkObjectId);
router.route('/:id/enroll').put(protect,checkObjectId,enrollStudentToCourse);
router.route('/:id/reviews').post(protect, checkObjectId, createCourseReview);
router.route('/:id/pending').get(protect,courseIsPending);
export default router;