import express from 'express';
import { createSchedule, deletedSchedule, getAllSchedules } from '../controllers/Schedule.controllers.js';

const routeSchedule = express.Router();

routeSchedule.post("/", createSchedule)
routeSchedule.get("/", getAllSchedules)
routeSchedule.delete("/:id", deletedSchedule);

export default routeSchedule;