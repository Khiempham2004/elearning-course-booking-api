import express from 'express';
import {
    enrollCourse,
    getAllEnrollment,
    getMyCourses,
    approveEnrollment,
    rejectEnrollment,
    updateEnrollmentStatus,
    getEnrollmentByUser,
    getEnrollmentByCourse,
    completeEnrollment,
    deleteEnrollment
} from '../controllers/Enrollment.controllers.js';
import verifytoken from '../middleware/auth.middleware.js';
import { authorize, isAdmin } from '../middleware/authorize.middleware.js';

const routesEnroll = express.Router();

// User routes
routesEnroll.post('/', verifytoken, authorize("User", "teacher", "admin"), enrollCourse);
routesEnroll.get('/my-courses', verifytoken, authorize("User" , "teacher", "admin"), getMyCourses);
routesEnroll.delete('/:id', verifytoken, isAdmin, deleteEnrollment);

// Admin routes
routesEnroll.get('/', verifytoken, authorize("admin", "teacher"), getAllEnrollment);

routesEnroll.patch('/:id/approve', verifytoken, isAdmin, approveEnrollment);
routesEnroll.patch('/:id/reject', verifytoken, isAdmin, rejectEnrollment);
routesEnroll.patch('/:id/complete', verifytoken, isAdmin, completeEnrollment);
routesEnroll.patch('/:id/status', verifytoken, isAdmin, updateEnrollmentStatus);

routesEnroll.get('/user/:userId', verifytoken, isAdmin, getEnrollmentByUser);
routesEnroll.get('/course/:courseId', verifytoken, authorize("admin", "teacher"), getEnrollmentByCourse);

export default routesEnroll;