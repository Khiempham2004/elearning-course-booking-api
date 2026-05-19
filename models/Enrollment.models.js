import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'approved'
    },
    enrollAt: {
        type: Date,
        default: Date.now
    },
    //Admin nào đã duyệt enrollment
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    // thời gian admin duyệt 
    approvedAt: {
        type: Date,
        default: null
    },
    // lý do từ chối enrollment
    rejectionReason: {
        type: String,
        default: null
    },
    // ghi chú
    notes: {
        type: String,
        default: null
    },
    // ngày user hoàn thành course
    completedAt: {
        type: Date,
        default: null
    }
},
    {
        timestamps: true
    }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true }); // không cho user đky cùng 1 course nhiều lần
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ createdAt: -1 });

const EnrollmentModel = mongoose.model("Enrollment", enrollmentSchema);
export default EnrollmentModel;
