import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routesUser from './routes/User.routes.js';
import routesCourse from './routes/Course.routes.js';
import routesEnroll from './routes/Enrollment.routes.js';
import routeSchedule from './routes/Schedule.routes.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use("/images", express.static("images"));

app.use('/api/users', routesUser);
app.use('/api/courses', routesCourse);
app.use('/api/schedules', routeSchedule);
app.use('/api/enrollments', routesEnroll);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.error(err));

