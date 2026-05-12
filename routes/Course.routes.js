import express from "express";
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse, } from "../controllers/Cousre.controllers.js";
import verifytoken from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const routesCourse = express.Router();

routesCourse.post("/", createCourse);
routesCourse.get("/", getAllCourses);
routesCourse.get("/:id", getCourseById);
routesCourse.put("/:id", updateCourse);
routesCourse.delete("/:id", deleteCourse);


export default routesCourse;