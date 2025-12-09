import multer from "multer";

// Creating storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {  // where the uploaded file will be saved
        cb(null /* No error */, "./public/temp")  // cb is a callback
    },

    filename: function (req, file, cb) { // what the uploaded file will be named
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // to make filename unique

        cb(null, file.fieldname + '-' + uniqueSuffix) // e.g., avatar-1632345678901-123456789

    },
})

// ------------- Instead of exporting multer instance we can export multer instance in function form -------------
// export const upload = multer({
//     storage,

//     limits: { fileSize: 1024 * 1024 * 1024 }, // 1 GB limit
// })

const imageMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const videoMimes = ["video/mp4",
    "video/quicktime",
    "video/mpeg",
    "video/x-matroska",
    "video/x-msvideo",
    "video/webm",
];

export const upload = (type = "both") => {
    return multer({
        storage,
        fileFilter: (req, file, cb) => {
            const mime = file.mimetype;

            if (type === "image" && !imageMimes.includes(mime))
                return cb(new Error("Only images allowed"), false);

            if (type === "video" && !videoMimes.includes(mime))
                return cb(new Error("Only videos allowed"), false);

            if (type === "both") {
                if (![...imageMimes, ...videoMimes].includes(mime))
                    return cb(new Error("Invalid file type"), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 1024 * 1024 * 100 }, // 100 MB limit
    })
};