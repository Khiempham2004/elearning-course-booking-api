import CourseModel from "../models/Cousre.models.js";
import EnrollmentModel from "../models/Enrollment.models.js";


export const createCourse = async (req, res) => {
    try {
        console.log("=== CREATE COURSE ===");
        console.log("BODY : ", req.body);
        console.log("FILES : ", req.files);

        if (!req.files) {
            console.log("⚠️ NO FILES RECEIVED");
        } else {
            console.log("✅ FILES RECEIVED");
            console.log("courseImage:", req.files.courseImage);
            console.log("instructorImage:", req.files.instructorImage);
        }

        const {
            title,
            lessons,
            level,
            rating,
            reviews,
            instructor,
            price,
            enrollLink,
            category
        } = req.body;

        const courseImage = req.files?.courseImage?.[0]?.filename
            ? `/uploads/${req.files.courseImage[0].filename}`
            : "";

        const instructorImage = req.files?.instructorImage?.[0]?.filename
            ? `/uploads/${req.files.instructorImage[0].filename}`
            : "";

        console.log("courseImage path:", courseImage);
        console.log("instructorImage path:", instructorImage);

        const newCourse = new CourseModel({
            title,
            lessons,
            level,
            rating,
            reviews,
            instructor,
            instructorImage,
            price,
            enrollLink,
            courseImage,
            category,
            createdBy: req.user.id
        });

        const course = await newCourse.save();

        res.status(201).json({
            message: "Tao khoa hoc thanh cong :",
            data: course,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
            success: false
        });
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
        const updateData = { ...req.body };

        if (req.files?.courseImage?.[0]?.filename) {
            updateData.courseImage = `/uploads/${req.files.courseImage[0].filename}`;
        }

        if (req.files?.instructorImage?.[0]?.filename) {
            updateData.instructorImage = `/uploads/${req.files.instructorImage[0].filename}`;
        }

        const updatedCourses = await CourseModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!updatedCourses) {
            return res.status(400).json({ message: "Khoa hoc khong ton tai!" })
        };

        res.status(200).json({
            message: "Cap nhat khoa hoc thanh cong",
            data: updatedCourses,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, success: false })
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

export const getMyCreatedCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        // Lấy courses do user tạo (có createdBy)
        const createdCourses = await CourseModel.find({ createdBy: userId })
            .select("-description")
            .sort({ createdAt: -1 });

        // Nếu không có courses do user tạo, lấy courses từ enrollments (cách cũ)
        let allCourses = createdCourses;
        if (createdCourses.length === 0) {
            const enrollments = await EnrollmentModel.find({ userId: userId })
                .populate(
                    "courseId",
                    "title lessons price level rating reviews instructor instructorImage courseImage category")
                .populate("approvedBy", "name email")
                .sort({ createdAt: -1 });

            allCourses = enrollments.map((e) => ({
                _id: e._id,
                enrollmentId: e._id,
                userId: e.userId,
                status: e.status,
                createdAt: e.createdAt,
                ...(e.courseId ? {
                    title: e.courseId.title,
                    lessons: e.courseId.lessons,
                    price: e.courseId.price,
                    level: e.courseId.level,
                    rating: e.courseId.rating,
                    reviews: e.courseId.reviews,
                    instructor: e.courseId.instructor,
                    instructorImage: e.courseId.instructorImage,
                    courseImage: e.courseId.courseImage,
                    catagory: e.courseId.catagory
                } : {})
            })).filter(e => e.courseImage || e.title);
        }

        res.status(200).json({
            success: true,
            message: "Danh sách khóa học của bạn",
            data: allCourses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        console.log(error);
    }
}