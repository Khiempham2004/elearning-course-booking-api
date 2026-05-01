import express from "express";
import { register, login, getUserProfile } from "../controllers/Auth.controllers.js";
import verifytoken from "../middleware/auth.middleware.js";
import { isAdmin, isUser } from "../middleware/admin.middleware.js";

const routesUser = express.Router();

routesUser.post("/register", register);
routesUser.post("/login", login);
// lấy token từ login
routesUser.get("/profile", verifytoken, getUserProfile)


routesUser.get("/admin/dashboard", verifytoken, isAdmin, (req, res) => {
    res.json({
        message: "Chào mừng đến với Admin Dashboard!",
        user: req.user
    })
});

routesUser.get("/user/dashboard", verifytoken, isUser, (req, res) => {
    res.json({
        message: "Chào mừng bạn đến với User Dashboard",
        user: req.user
    })
})
export default routesUser;