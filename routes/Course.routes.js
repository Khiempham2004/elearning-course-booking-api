import express from "express";
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse, getMyCreatedCourses } from "../controllers/Cousre.controllers.js";
import verifytoken from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import upload from "../middleware/upload.middleware.js";

const routesCourse = express.Router();

routesCourse.post("/",
    verifytoken,
    upload.fields([
        { name: 'courseImage', maxCount: 1 },
        { name: 'instructorImage', maxCount: 1 }
    ]),
    createCourse
);
routesCourse.get("/my-courses", verifytoken, getMyCreatedCourses);
routesCourse.get("/", getAllCourses);
routesCourse.get("/:id", getCourseById);
routesCourse.put("/:id",
    verifytoken,
    upload.fields([
        { name: 'courseImage', maxCount: 1 },
        { name: 'instructorImage', maxCount: 1 }
    ]),
    updateCourse
);
routesCourse.delete("/:id", verifytoken, deleteCourse);


export default routesCourse;