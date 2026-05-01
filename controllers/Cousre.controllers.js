import CourseModel from "../models/Cousre.models.js";
import EnrollmentModel from "../models/Enrollment.models.js";


export const createCourse = async (req, res) => {
    try {
        const newCourse = new CourseModel(req.body);

        const course = await newCourse.save();

        res.status(201).json({
            message: "Tao khoa hoc thanh cong :",
            data: course
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getAllCourses = async (req, res) => {
    try {
        const courses = await CourseModel.find();
        const mappedCourses = courses.map((course) => course);
        console.log('course', mappedCourses);

        res.status(200).json({
            message: "Lay danh sach khoa hoc thanh cong : ",
            data: mappedCourses
        });
    } catch (error) {
        res.status(500).json(error.message);
        console.log(error);
    }
}

export const getCourseById = async (req, res) => {
    try {
        const newCourseById = await CourseModel.findById(req.params.id);
        if (!newCourseById) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({
            message: "Lay khoa hoc thanh cong : ",
            data: newCourseById,
        });
    } catch (error) {
        res.status(500).json(error.message);
        console.log(error);
    }
}

export const getCourseDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const courseDetail = await CourseModel.findById(id);

        if (!courseDetail) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({
            message: "Lay chi tiet khoa hoc thanh cong : ",
            data: courseDetail,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const updateCourse = async (req, res) => {
    try {
        const updatedCourses = await CourseModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedCourses) {
            return res.status(400).json({ message: "Khoa hoc khong ton tai!" })
        };

        res.status(200).json("Cap nhat khoa hoc thanh cong : ", updatedCourses);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message)
    }
}


export const deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await CourseModel.findByIdAndDelete(req.params.id);
        if (!deleteCourse) {
            return res.status(400).json({ message: "Course not found" })
        }
        res.status(200).json("Course deleted successfully", deletedCourse);
    } catch (error) {
        res.status(500).json(error.message)
    }
}
// API lấy danh sách khóa học mà user đã đăng ký
export const getMyCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        const enrollments = await EnrollmentModel.find({ userId }).populate("courseId"); // de join course

        const courses = enrollments.map((e) => e.courseId).filter(Boolean);

        res.status(200).json({
            message: "Lấy danh sách course thành công",
            courses,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Lỗi server ", error })
    }
}
