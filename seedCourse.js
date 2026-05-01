import mongoose from "mongoose";
import CourseModel from "./models/Cousre.models.js";
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const normalizeImagePath = (imagePath) => {
    if (!imagePath) return "";

    const fileName = imagePath.split("/").pop();
    return `/images/${fileName}`;
};

const data = JSON.parse(
    fs.readFileSync("./data/CourseData.json", "utf-8")
);
console.log(data);

const importData = async () => {
    try {
        await CourseModel.deleteMany(); //clear db
        let courseArr = [];

        Object.keys(data.Courses).forEach((category) => {
            data.Courses[category].forEach((course) => {
                courseArr.push({
                    title: course.title,
                    lessons: course.lessons,
                    level: course.level,
                    rating: course.rating,
                    reviews: course.reviews,
                    instructor: course.instructor,
                    instructorImage: normalizeImagePath(course.InstructorImage),
                    price: course.price,
                    enrollLink: course.enrollLink,
                    courseImage: normalizeImagePath(course.CourseImage),
                    catagory: category,
                })
            })
        })

        await CourseModel.insertMany(courseArr);
        console.log("Import data succesfully!");
        // process.exit();
    } catch (error) {
        console.log(error);
        // process.exit(1);
    }
};

importData();
