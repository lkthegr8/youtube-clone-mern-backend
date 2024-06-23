import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, //for identification
  api_secret: process.env.CLOUDINARY_API_SECRET, // for authentication / encryption
});

//   upload on cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    // upload the file on cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        // upload options
        resource_type: "auto",
      }
    );
    // file uiploaded successfully
    console.log("file is uploaded on cloudinary", uploadResult.url);
    return uploadResult;
  } catch (error) {
    console.log(error);
    // if file not uploaded properly then delete the file in local server so not to have further issues
    fs.unlinkSync(localFilePath); // synchronous way to delete, will remove the locally saved temp file
    return null;
  }
};

export { uploadOnCloudinary };
//   // Optimize delivery by resizing and applying auto-format and auto-quality
//   const optimizeUrl = cloudinary.url("shoes", {
//     fetch_format: "auto",
//     quality: "auto",
//   });

//   console.log(optimizeUrl);

//   // Transform the image: auto-crop to square aspect_ratio
//   const autoCropUrl = cloudinary.url("shoes", {
//     crop: "auto",
//     gravity: "auto",
//     width: 500,
//     height: 500,
//   });

//   console.log(autoCropUrl);
