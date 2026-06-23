import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routesUser from './routes/User.routes.js';
import routesCourse from './routes/Course.routes.js';
import routesEnroll from './routes/Enrollment.routes.js';
import routeSchedule from './routes/Schedule.routes.js';

dotenv.config();

const app = express();
let mongoConnectionPromise;

export const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not configured');
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!mongoConnectionPromise) {
        mongoConnectionPromise = mongoose.connect(process.env.MONGO_URI);
    }

    return mongoConnectionPromise;
};

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('API is running');
});

app.get('/api', (req, res) => {
    res.send('API is running');
});

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running'
    });
});

app.use("/images", express.static("images"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api', async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('MongoDB connection error:', error);
        res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
});

app.use('/api/users', routesUser);
app.use('/api/courses', routesCourse);
app.use('/api/enrollments', routesEnroll);
app.use('/api/schedules', routeSchedule);

export default app;
