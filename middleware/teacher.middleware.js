export const isTeacher = async (req, res, next) => {
    if (!req.user.role !== 'teacher') {
        return res.status(403).json({
            message: "Cần có sự cho phép của Giáo Viên!"
        });
    }
    next();
}