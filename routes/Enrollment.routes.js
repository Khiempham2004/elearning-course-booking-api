import express from 'express';
import { 
    cancelEnrollment, 
    enrollCourse, 
    getAllEnrollment, 
    getMyCourses,
    approveEnrollment,
    rejectEnrollment,
    updateEnrollmentStatus,
    getEnrollmentByUser,
    getEnrollmentByCourse
} from '../controllers/Enrollment.controllers.js';
import verifytoken from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const routesEnroll = express.Router();

// User routes
routesEnroll.post('/', verifytoken, enrollCourse);
routesEnroll.get('/my-courses', verifytoken, getMyCourses);
routesEnroll.delete('/:id', verifytoken, cancelEnrollment);

// Admin routes
routesEnroll.get('/', verifytoken, isAdmin, getAllEnrollment);
routesEnroll.patch('/:id/approve', verifytoken, isAdmin, approveEnrollment);
routesEnroll.patch('/:id/reject', verifytoken, isAdmin, rejectEnrollment);
routesEnroll.patch('/:id/status', verifytoken, isAdmin, updateEnrollmentStatus);
routesEnroll.get('/user/:userId', verifytoken, getEnrollmentByUser);
routesEnroll.get('/course/:courseId', verifytoken, isAdmin, getEnrollmentByCourse);

export default routesEnroll;