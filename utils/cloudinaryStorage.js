const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "buyhive_products", // Folder in Cloudinary
    resource_type: "image",

    allowed_formats: ["jpg", "jpeg", "png", "webp"],

    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,

    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto" }
    ],
  }),
});

module.exports = storage;