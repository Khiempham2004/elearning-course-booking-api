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
            return res.status(400).json({ message: 'Bạn đã đăng ký course này rồi' })
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course không tồn tại!" })
        }
        const enrollment = await EnrollmentModel.create({
            userId: userId,
            courseId: courseId,
            status: 'pending'
        });

        res.status(201).json({
            message: "Đăng ký thành công, chờ admin duyệt",
            data: enrollment,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error.message);
    }
}

// lay course cua User
export const getMyCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        const enrollments = await EnrollmentModel.find({ userId })
            .populate(
                "courseId",
                "title lessons price level rating reviews instructor instructorImage courseImage catagory")
            .populate("approvedBy", "name email");

        // Map enrollment data with full course info
        const courses = enrollments.map((e) => ({
            _id: e._id,
            enrollmentId: e._id,
            userId: e.userId,
            status: e.status,
            createdAt: e.createdAt,
            // Spread course data
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

        res.status(200).json({
            message: "Danh sách khóa học",
            courses: courses,
        });
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
        if (!resEnroll) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        res.json({
            success: true,
            message: 'Hủy đăng ký thành công',
            resEnroll
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
        console.log(error);
    }
}

//Admin xem all
export const getAllEnrollment = async (req, res) => {
    try {
        const enrollments = await EnrollmentModel.find()
            .populate("userId", "name email role")
            .populate("courseId", "title price level")
            .populate("approvedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Tất cả đã đăng ký",
            enrollments
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Approve enrollment
export const approveEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        const { notes } = req.body;

        const enrollment = await EnrollmentModel.findById(id);
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment không tồn tại" });
        }

        if (enrollment.status === 'approved') {
            return res.status(400).json({ message: "Enrollment đã được duyệt" });
        }

        enrollment.status = 'approved';
        enrollment.approvedBy = adminId;
        enrollment.approvedAt = new Date();
        if (notes) enrollment.notes = notes;

        await enrollment.save();
        await enrollment.populate("userId", "name email");
        await enrollment.populate("courseId", "title");
        await enrollment.populate("approvedBy", "name email");

        res.status(200).json({
            message: "Duyệt đăng ký thành công",
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

// Reject enrollment
export const rejectEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        const { rejectionReason, notes } = req.body;

        if (!rejectionReason) {
            return res.status(400).json({ message: "Vui lòng cung cấp lý do từ chối" });
        }

        const enrollment = await EnrollmentModel.findById(id);
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment không tồn tại" });
        }

        if (enrollment.status === 'rejected') {
            return res.status(400).json({ message: "Enrollment đã được từ chối" });
        }

        enrollment.status = 'rejected';
        enrollment.approvedBy = adminId;
        enrollment.approvedAt = new Date();
        enrollment.rejectionReason = rejectionReason;
        if (notes) enrollment.notes = notes;

        await enrollment.save();
        await enrollment.populate("userId", "name email");
        await enrollment.populate("courseId", "title");
        await enrollment.populate("approvedBy", "name email");

        res.status(200).json({
            message: "Từ chối đăng ký thành công",
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

// Update enrollment status
export const updateEnrollmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }

        const enrollment = await EnrollmentModel.findById(id);
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment không tồn tại" });
        }

        enrollment.status = status;
        if (status === 'completed') {
            enrollment.completedAt = new Date();
        }
        if (notes) enrollment.notes = notes;

        await enrollment.save();
        await enrollment.populate("userId", "name email");
        await enrollment.populate("courseId", "title");
        await enrollment.populate("approvedBy", "name email");

        res.status(200).json({
            message: "Cập nhật trạng thái thành công",
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

// Get enrollment by user
export const getEnrollmentByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const enrollments = await EnrollmentModel.find({ userId })
            .populate("courseId", "title price level rating reviews")
            .populate("approvedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Danh sách đăng ký của user",
            enrollments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

// Get enrollment by course
export const getEnrollmentByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const enrollments = await EnrollmentModel.find({ courseId })
            .populate("userId", "name email role")
            .populate("approvedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Danh sách đăng ký của course",
            enrollments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

// Complete enrollment - Admin hoàn thành khóa học cho học viên
export const completeEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        const { notes } = req.body;

        const enrollment = await EnrollmentModel.findById(id);
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment không tồn tại" });
        }

        // Chỉ cho phép hoàn thành nếu đã được duyệt
        if (enrollment.status !== 'approved') {
            return res.status(400).json({
                message: "Chỉ có thể hoàn thành enrollment đã được duyệt (approved)"
            });
        }

        enrollment.status = 'completed';
        enrollment.completedAt = new Date();
        if (notes) enrollment.notes = notes;

        await enrollment.save();
        await enrollment.populate("userId", "name email");
        await enrollment.populate("courseId", "title");
        await enrollment.populate("approvedBy", "name email");

        res.status(200).json({
            message: "Hoàn thành khóa học thành công",
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}