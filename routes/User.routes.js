import express from "express";
import { register, login, getUserProfile, getAllUsers, deleteUser, updateUserRole, updateProfile, createUser } from "../controllers/Auth.controllers.js";
import verifytoken from "../middleware/auth.middleware.js";
import { authorize, isAdmin, isUser } from "../middleware/authorize.middleware.js";

const routesUser = express.Router();

routesUser.post("/register", register);
routesUser.post("/login", login);

// lấy token từ login
routesUser.get("/profile", verifytoken, getUserProfile);

routesUser.get("/admin/dashboard", verifytoken, authorize("admin"), (req, res) => {
    res.json({
        message: "Chào mừng đến với Admin Dashboard!",
        user: req.user
    })
});

routesUser.get("/user/dashboard", verifytoken, authorize("User", "admin", "teacher"), (req, res) => {
    res.json({
        message: "Chào mừng bạn đến với User Dashboard",
        user: req.user
    })
})

routesUser.get("/teacher/dashboard", verifytoken, authorize("admin", "teacher"), (req, res) => {
    res.json({
        message: "Chào mừng bạn đến với Teacher Dashboard",
        user: req.user
    })
})

routesUser.get("/", verifytoken, authorize("admin", "teacher"), getAllUsers);

routesUser.post("/", verifytoken, authorize("admin"), createUser)

routesUser.delete("/:id", verifytoken, authorize("admin"), deleteUser);

routesUser.put("/profile", verifytoken, updateProfile);

routesUser.put("/:id", verifytoken, authorize("admin"), updateUserRole);


export default routesUser;