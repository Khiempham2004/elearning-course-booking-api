import ScheduleModel from "../models/Schedule.models.js";

export const createSchedule = async (req, res) => {
    try {
        const { courseId, instructor, date, time } = req.body;
        console.log("Body:", req.body);

        if (!courseId || !instructor || !date || !time) {
            return res.status(400).json({
                message: "Vui long dien vao tat ca truong"
            });
        };

        const newSchedule = new ScheduleModel({
            courseId,
            instructor,
            date,
            time,
        });

        const savedSchedule = await newSchedule.save();
        res.status(201).json({
            message: "Tao lich trinh thanh cong",
            savedSchedule,
        });

    } catch (error) {
        res.status(500).json('Schedule is not error', error)
        console.log(error);
    }
}

// get tat ca lich trinh
export const getAllSchedules = async (req, res) => {
    try {
        const schedules = await ScheduleModel.find();
        res.status(201).json({
            message: "Lay tat ca lich trinh thanh cong",
            schedules,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message)
    }
}

export const deletedSchedule = async (req, res) => {
    try {
        const { id } = req.params;

        await ScheduleModel.findByIdAndDelete(id);

        res.status(201).json({
            message: 'Xoa lich thanh cong'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Xoa lich khong thanh cong",
            error: error.message
        })
    }
}