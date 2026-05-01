import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        module: true
    },
    lessons: {
        type: Number,
        default: 0,
    },
    level: {
        type: String,
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: String,
    },
    instructor: {
        // type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        type: String
    },
    instructorImage: {
        type: String,
    },
    price: {
        type: Number,
        default: 0,
    },
    enrollLink: {
        type: String,
        default: 'enroll Now'
    },
    courseImage: {
        type: String
    },
    catagory: {
        type: String
    }
});

const CourseModel = mongoose.model("Course", courseSchema);

export default CourseModel;