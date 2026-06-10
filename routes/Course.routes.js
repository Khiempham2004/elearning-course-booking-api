import express from "express";
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse, getMyCreatedCourses } from "../controllers/Cousre.controllers.js";
import verifytoken from "../middleware/auth.middleware.js";
import { authorize, isAdmin } from "../middleware/authorize.middleware.js";
import upload from "../middleware/upload.middleware.js";

const routesCourse = express.Router();

routesCourse.post("/",
    verifytoken,
    authorize("admin", "teacher"),
    upload.fields([
        { name: 'courseImage', maxCount: 1 },
        { name: 'instructorImage', maxCount: 1 }
    ]),
    createCourse
);
routesCourse.get("/my-courses", verifytoken, authorize("admin", "teacher"), getMyCreatedCourses);
routesCourse.get("/", getAllCourses);
routesCourse.get("/:id", getCourseById);

routesCourse.put("/:id",
    verifytoken,
    authorize("admin", "teacher"),
    upload.fields([
        { name: 'courseImage', maxCount: 1 },
        { name: 'instructorImage', maxCount: 1 }
    ]),
    updateCourse
);
routesCourse.delete("/:id", verifytoken, authorize("admin", "teacher"), deleteCourse);


export default routesCourse; 