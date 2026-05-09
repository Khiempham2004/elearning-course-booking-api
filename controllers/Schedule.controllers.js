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

// get tat ca lich học
export const getAllSchedules = async (req, res) => {
    try {
        const schedules = await ScheduleModel.find().populate("courseId");
        res.status(201).json({
            message: "Lay tat ca lich học thanh cong",
            schedules,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message)
    }
}
// lay chi tiet lich hoc
export const getSchedulesDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const detail = await ScheduleModel.findById(id).populate("courseId");
        if (!detail) {
            return res.status(404).json({
                message: "Không tìm thấy lịch học"
            })
        }
        res.status(200).json({
            message: "Lấy chi tiết lịch học thành công",
            data: detail
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}
//Cap nhat lich hoc
export const updateSchedule = async (req, res) => {
    try {
        const id = req.params.id;

        const update = await ScheduleModel.findByIdAndUpdate(id, req.body, {
            new: true
        });
        if (!update) {
            return res.status(404).json({
                message: "Không tìm thấy lịch học"
            })
        }
        res.status(200).json({
            message: "Cập nhật thành công",
            data: update
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
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