import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("✅ Multer destination called for file:", file.originalname, "Field:", file.fieldname);
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const filename = Date.now() + "-" + file.originalname;
        console.log("✅ Multer filename set to:", filename);
        cb(null, filename);
    }
})

const upload = multer({ 
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB
    },
    fileFilter: (req, file, cb) => {
        console.log("✅ Multer fileFilter - Processing file:", file.fieldname, file.originalname, "Size:", file.size);
        cb(null, true);
    }
});

console.log("✅ Multer middleware initialized");

export default upload;