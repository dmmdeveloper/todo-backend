import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"
import {unlinkSync} from "node:fs"
dotenv.config({path:".env"})

// Cloudinary configuration
cloudinary.config({
    cloud_name : "dtqli9uge",
    api_key: "445545137513154",
    api_secret :"e7vlmObww4ZrF-24HkdfvwTjkxY"
})


export const uploadOnCloudinary = async (filePath) =>{
    try {
        if(!filePath) return;
const response = await cloudinary.uploader.upload(filePath)
unlinkSync(filePath)
return response.url;
    } catch (error) {
unlinkSync(filePath)
        console.log("File not uploaded on Cloudinary  :)" , error );
        return null
    }
}