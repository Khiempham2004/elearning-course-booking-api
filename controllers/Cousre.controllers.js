import CourseModel from "../models/Cousre.models.js";


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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;

        const courses = await CourseModel.find().select(
            "-reviews -description"
        ).limit(limit).skip((page - 1) * limit).sort({ createdAt: -1 }).lean();

        const total = await CourseModel.countDocuments();

        res.status(200).json({
            success: true,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            message: "Lay danh sach khoa hoc thanh cong : ",
            data: courses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        console.log(error);
    }
}

//detail course
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
        res.status(500).json({
            message: error.message
        });
        console.log(error);
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
        if (!deletedCourse) {
            return res.status(400).json({ message: "Course not found" })
        }
        res.status(200).json("Course deleted successfully", deletedCourse);
    } catch (error) {
        res.status(500).json(error.message)
    }
}

