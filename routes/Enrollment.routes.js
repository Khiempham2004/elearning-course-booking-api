import express from 'express';
import { cancelEnrollment, enrollCourse, getAllEnrollment, getCourse } from '../controllers/Enrollment.controllers.js';
import verifytoken from '../middleware/auth.middleware.js';

const routesEnroll = express.Router();

// lay course da dky theo User
routesEnroll.post('/', verifytoken, enrollCourse);
routesEnroll.get('/user/:userId', getCourse);
routesEnroll.delete('/:id', cancelEnrollment);
routesEnroll.get('/', getAllEnrollment);// admin xem tat ca cac dky course

export default routesEnroll;