import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // For file system operations 

// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {  // getting file local path 
    try {
        if (!filePath) {
            throw new Error('File path is required for upload');
        }

        const result = await cloudinary.uploader.upload(filePath, { resource_type: "auto" });

        // delete the file from local storage after upload
        fs.unlinkSync(filePath);

        return result;

    } catch (error) {
        // delete the file from local storage after error
        fs.unlinkSync(filePath);

        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Cloudinary :: upload failed: ' + error.message);
    }
}

const deleteOnCloudinary = async (public_id, resource_type = "image") => {
    if (!public_id) throw new Error("public_id is required");

    try {

        const response = await cloudinary.uploader.destroy(public_id, {
            resource_type: resource_type
        });

        return response;

    } catch (error) {
        console.error("Cloudinary :: Faild to delete:", error);
        throw new Error("Cloudinary :: Faild to delete:", error.message);
    }

}

export { uploadOnCloudinary, deleteOnCloudinary };