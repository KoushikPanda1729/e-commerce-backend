import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;
  try {
    const cloudinaryURL = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return cloudinaryURL;
  } catch (error) {
    console.log("Error occured at cloudinary ", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export const deleteOnCloudinary = async (publicId) => {
  if (!publicId) return null;
  try {
    await cloudinary.uploader.destroy(publicId);
    return;
  } catch (error) {
    console.log("Error occured at delete on cloudinary :: ", error);
    return error;
  }
};
export default uploadOnCloudinary;
