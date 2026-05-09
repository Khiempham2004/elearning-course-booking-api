import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["User", "teacher", "admin"],
        default: "User"
    },
},
    {
        timestamps: true
    }
)
const User = mongoose.model("User", userSchema);
export default User;