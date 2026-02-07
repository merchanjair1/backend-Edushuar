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

        // Check if it's already a URL
        if (base64String.startsWith('http')) {
            return base64String;
        }

        // Validate that it's a data URI or at least looks like base64
        // If it contains "...", it's likely a placeholder and should be handled gracefully
        if (base64String.includes("...")) {
            console.warn("DEBUG: Placeholder Base64 detected, skipping upload and returning null.");
            return null;
        }

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "eduShuar",
                    resource_type: "auto"
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        reject(new Error("Error al subir la imagen a Cloudinary"));
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );

            // Convert Base64 to Buffer and pipe to Cloudinary
            const base64Data = base64String.split(",")[1] || base64String;
            const buffer = Buffer.from(base64Data, 'base64');
            uploadStream.end(buffer);
        });
    } catch (error) {
        console.error("Cloudinary Upload Error Catch:", error);
        throw new Error("Error al procesar la imagen");
    }
};

module.exports = { upload, uploadBase64 }
