import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    instructor: String,
    date: Date,
    time: String,
});

const ScheduleModel = mongoose.model("Schedule", scheduleSchema);

export default ScheduleModel;