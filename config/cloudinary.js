import cloudinary from "cloudinary";
import dotenv from "dotenv";

/* 🔥 FORCE ENV LOAD FOR THIS MODULE */
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* 🔎 FINAL TEST */
console.log("✅ CLOUDINARY CONFIG:", {
  cloud_name: cloudinary.v2.config().cloud_name,
  api_key: cloudinary.v2.config().api_key,
});

export default cloudinary;
