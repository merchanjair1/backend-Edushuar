const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../config/cloudinary")

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "eduShuar",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
})

const upload = multer({ storage })

const uploadBase64 = async (base64String) => {
    try {
        if (!base64String) return null;

        // Check if it's already a URL (in case frontend sends existing URL on update)
        if (base64String.startsWith('http')) {
            return base64String;
        }

        const result = await cloudinary.uploader.upload(base64String, {
            folder: "eduShuar",
            resource_type: "auto"
        });
        return result.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Error al subir la imagen");
    }
};

module.exports = { upload, uploadBase64 }
