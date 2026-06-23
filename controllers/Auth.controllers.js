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

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            users,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email không tồn tại"
            })
        };

        const hashPassword = await bcrypt.hash(
            password, 10
        );

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        });

        res.status(201).json({
            success: true,
            message: "Tạo tài khoản thành công",
            data: user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Delete user success"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role, name, email } = req.body;

        if (!role || !['admin', 'User', "teacher"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be 'admin' or 'User'"
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role, name, email },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        console.log("BDOY : ", req.body);
        console.log("USER : ", req.user);

        const { name, email, password } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name  is required"
            });
        }

        const existingEmail = await User.findOne({
            email,
            _id: { $ne: req.user._id }
        });


        if (existingEmail) {
            return res.status(400).json({
                message: "Email aldready exists"
            })
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                name,
                email,
                password
            },
            {
                new: true
            }
        ).select("-password");
        res.status(200).json({
            success: true,
            message: "Cập nhật profile thành công",
            data: user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật thất bại"
        })
    }
}

export const changePassword = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}