import mongoose from "mongoose";
//Tuyen sinh

const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    enrollAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    }
);
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const EnrollmentModel = mongoose.model("Enrollment", enrollmentSchema);
export default EnrollmentModel;
