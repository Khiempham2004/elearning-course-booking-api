import express from "express";
import {  createCourse, deleteCourse, getAllCourses, getCourseById , getMyCourses, updateCourse, } from "../controllers/Cousre.controllers.js";
import verifytoken from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const routesCourse = express.Router();

routesCourse.post("/", createCourse);
routesCourse.get("/", getAllCourses);

routesCourse.get('/my-course', verifytoken, getMyCourses);

routesCourse.get("/:id", getCourseById);

routesCourse.put("/:id", updateCourse);
routesCourse.delete("/:id", deleteCourse);


export default routesCourse;