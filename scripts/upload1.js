// scripts/upload.js (CommonJS version)

const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const folderPath = "./client/public/reviews";
const uploadFolder = "serenity/reviews";

const files = fs.readdirSync(folderPath);

files.forEach((file) => {
  const filePath = path.join(folderPath, file);

  cloudinary.uploader
    .upload(filePath, { folder: uploadFolder })
    .then((result) => {
      console.log(`✅ Uploaded: ${file}`);
      console.log(`   → ${result.secure_url}`);
    })
    .catch((err) => {
      console.error(`❌ Failed to upload ${file}:`, err.message);
    });
});
