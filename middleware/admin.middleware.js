export const isAdmin = async (req, res, next) => {
    if (req.user.role !== "admin" && req.user.role !== "teacher") {
        return res.status(403).json({
            message: "Chi admin moi duoc truy cap"
        });
    }
    next();
}

export const isUser = async (req, res, next) => {
    if (req.user.role !== "User") {
        return res.status(403).json({
            message: "Chi User moi duoc truy cap"
        });
    }
    next();
}