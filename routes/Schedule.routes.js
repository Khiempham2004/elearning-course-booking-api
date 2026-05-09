import express from 'express';
import { createSchedule, deletedSchedule, getAllSchedules, getSchedulesDetail, updateSchedule } from '../controllers/Schedule.controllers.js';

const routeSchedule = express.Router();

routeSchedule.get("/", getAllSchedules);
routeSchedule.get("/:id", getSchedulesDetail);
routeSchedule.post("/", createSchedule);
routeSchedule.put("/:id", updateSchedule)
routeSchedule.delete("/:id", deletedSchedule);

export default routeSchedule;