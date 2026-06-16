import ScheduleModel from "../models/Schedule.models.js";
import EnrollmentModel from "../models/Enrollment.models.js";
import CourseModel from "../models/Cousre.models.js";

export const createSchedule = async (req, res) => {
    try {
        const { courseId, instructor, date, time } = req.body;
        console.log("Body:", req.body);

        if (!courseId || !instructor || !date || !time) {
            return res.status(400).json({
                message: "Vui long dien vao tat ca truong"
            });
        };

        const courseExists = await CourseModel.findById(courseId);
        if (!courseExists) {
            return res.status(404).json({
                message: "Khóa học không tồn tại"
            });
        }

        const newSchedule = new ScheduleModel({
            courseId,
            instructor,
            date,
            time,
        });

        const savedSchedule = await newSchedule.save();
        res.status(201).json({
            message: "Tạo lịch học thành công",
            savedSchedule,
        });

    } catch (error) {
        res.status(500).json({ message: "Schedule is not error", error });
        console.log(error);
    }
}

// get tat ca lich học
export const getAllSchedules = async (req, res) => {
    try {
        const schedules = await ScheduleModel.find().populate("courseId", "title");
        res.status(200).json({
            message: "Lấy tất cả lịch học thành công",
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
        const detail = await ScheduleModel.findById(id).populate("courseId", "title description");
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

// lấy lịch học của User
export const getMySchedules = async (req, res) => {
    try {
        console.log("REQ Debug : ", req.user);

        const userId = req.user.id;

        const enrollments = await EnrollmentModel.find({
            userId,
            status: "approved"
        });

        console.log("enrollments : ", enrollments);


        const courseIds = enrollments.map(enrollment => enrollment.courseId);

        if (courseIds.length === 0) {
            return res.status(200).json({
                message: "Người dùng chưa có khóa học phê duyệt hoặc đang chờ xét duyệt",
                schedules: [],
                data: [],
            });
        }
        const mySchedules = await ScheduleModel
            .find({
                courseId:
                    { $in: courseIds } // tìm các document có giá trị nằm trong mảng
            })
            .populate("courseId", "title description image")
            .sort({ date: 1, time: 1 });
        console.log("SCHEDULE : ", mySchedules);


        res.status(200).json({
            message: "Lấy lịch học của người dùng thành công",
            schedules: mySchedules,
            data: mySchedules
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}


export const updateMySchedule = async (req, res) => {
    const userId = req.user.id;
    const scheduleId = req.params.id;

    const schedule = await ScheduleModel.findById(scheduleId);

    if (!schedule) {
        return res.status(404).json({
            message: "Không tìm thấy lịch học"
        });
    }

    const enrollment = await EnrollmentModel.findOne({
        userId,
        courseId: schedule.courseId,
        status: "approved"
    });

    if (!enrollment) {
        return res.status(403).json({
            message: "Bạn không có quyền sửa lịch này"
        });
    }

    const updated = await ScheduleModel.findByIdAndUpdate(
        scheduleId,
        req.body,
        { new: true }
    );

    res.json(updated);
};


//Cap nhat lich hoc
export const updateSchedule = async (req, res) => {
    try {
        const id = req.params.id;

        const update = await ScheduleModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
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

        const deleted = await ScheduleModel.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                message: "Không tìm thấy lịch học"
            })
        }

        res.status(200).json({
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
