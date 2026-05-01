import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.models.js";


export const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;
        const exsitingUser = await User.findOne({ email });
        if (exsitingUser) {
            return res.status(400).json({ message: "Email already exiting" })
        };
        if (password !== confirmPassword) {
            return res.status(400).json("Password khong giong nhau")
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role,
        })

        await newUser.save();

        res.status(200).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.log(error);
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const newUser = await User.findOne({ email });
        if (!newUser) return res.status(400).json({ message: "User not found" });

        const isMatchLearn = await bcrypt.compare(password, newUser.password);
        if (!isMatchLearn) return res.status(400).json({ message: "Wrong password" });

        const payload = {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
        };
        // const SECRET = 'your-secret-key'
        const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token, newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.log(error);
    }
}


export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại' })
        };
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Lỗi server!', error })
    }
}
