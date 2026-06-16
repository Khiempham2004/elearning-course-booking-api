import express from 'express';
import { createSchedule, deletedSchedule, getAllSchedules, getMySchedules, getSchedulesDetail, updateMySchedule, updateSchedule } from '../controllers/Schedule.controllers.js';
import verifytoken from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorize.middleware.js';

const routeSchedule = express.Router();

routeSchedule.get("/", verifytoken, authorize("admin", "teacher"), getAllSchedules);
routeSchedule.get("/my-schedules", verifytoken, authorize("User"), getMySchedules);

routeSchedule.get("/:id", verifytoken, authorize("admin", "User", "teacher"), getSchedulesDetail);
routeSchedule.post("/", verifytoken, authorize("admin"), createSchedule);
routeSchedule.patch("/:id", verifytoken, authorize("admin"), updateSchedule);
routeSchedule.delete("/:id", verifytoken, authorize("admin"), deletedSchedule);

//my-schedules
routeSchedule.patch("/:id", verifytoken, authorize("User"), updateMySchedule)

export default routeSchedule;