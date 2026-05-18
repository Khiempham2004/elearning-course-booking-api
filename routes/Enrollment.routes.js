import express from 'express';
import { cancelEnrollment, enrollCourse, getAllEnrollment, getMyCourses } from '../controllers/Enrollment.controllers.js';
import verifytoken from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const routesEnroll = express.Router();

routesEnroll.post('/', verifytoken, enrollCourse);
routesEnroll.get('/my-courses', verifytoken, getMyCourses);
routesEnroll.delete('/:id', verifytoken, cancelEnrollment);
routesEnroll.get('/', verifytoken, isAdmin, getAllEnrollment);

export default routesEnroll;