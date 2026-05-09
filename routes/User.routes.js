import express from "express";
import { register, login, getUserProfile, getAllUsers, deleteUser, updateUserRole } from "../controllers/Auth.controllers.js";
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

routesUser.get("/", verifytoken, isAdmin, getAllUsers);

routesUser.delete("/:id", verifytoken, isAdmin, deleteUser);

routesUser.put("/:id", verifytoken, isAdmin, updateUserRole);

export default routesUser;