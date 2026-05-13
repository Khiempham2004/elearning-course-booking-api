import jwt from 'jsonwebtoken'
import User from '../models/User.models.js';

const verifytoken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json('Khong co token');
        }

        const tokenAuth = token.split(" ")[1];

        const verified = jwt.verify(tokenAuth, process.env.SECRET_KEY);

        const user = await User.findById(verified.id);

        if (!user) {
            return res.status(404).json({
                message: "User không tồn tại"
            })
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Token khong hop le"
        })
    }
}

export default verifytoken;