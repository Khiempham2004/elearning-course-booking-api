import CourseModel from "../models/Cousre.models.js";
import EnrollmentModel from "../models/Enrollment.models.js";

//dky course
export const enrollCourse = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('userid', userId);

        const { courseId } = req.body;
        const existing = await EnrollmentModel.findOne({ userId, courseId });
        if (existing) {
            return res.status(404).json({ message: 'Ban da dang ky course nay roi' })
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course đã tồn tại!" })
        }
        const enrollment = await EnrollmentModel.create({
            userId: userId,
            courseId: courseId,
            status: 'approved'
        });

        res.status(201).json({
            message: "Dang ky thanh cong",
            data: enrollment,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error.message);
    }
}

// lay course cua User
export const getCourse = async (req, res) => {
    try {
        const { userId } = req.params;

        const enrollments = await EnrollmentModel.find({ userId }).populate("courseId");

        res.status(200).json({ message: "Danh sách khóa học", enrollments });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

//Huy register
export const cancelEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const resEnroll = await EnrollmentModel.findByIdAndDelete(id);
        res.json({ message: 'Huy dang ky thanh cong' }, resEnroll);
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error);
    }
}

//Admin xem all
export const getAllEnrollment = async (req, res) => {
    try {
        const enrollments = await EnrollmentModel.find().populate("userId", " name email").populate("courseId", "title");
        res.status(200).json({ message: "Tất cả đã đăng ký", enrollments });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}