import { APIError } from "../utils/apierror.utils.js";
import { APIREsponse, Response } from "../utils/apiresponse.utils.js";
import { asyncHandler } from "../utils/asynhandler.utils.js";
import z from "zod"
import {unlinkSync } from "node:fs"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/uploadonCloudinary.utils.js";


const generateToken = async (userID)=>{
try {
    
        const findUser = await User.findById(userID)
        const token = await findUser.generateToken();
    findUser.token = token;    
    await findUser.save()
    return token
} catch (error) {
    console.log("Eror While Generate Token" , error);
    
    
}

}


const userSchema = z.object({
    email : z.string().email( { message:"Invalid Email Address"}),
    password : z.string().min(6 , { message : "Password at least 6 characters"})
})



const Register = asyncHandler( async (req,res )=>{
    console.log(req.url);


    // get data -- text
    // get file 
    // empty validation
    // zod validation 
    // find User in DB;
    // upload image in cloudinary
    // create a user object 
    // check for user creation -- and remove unnessery fields create a Profile
    // if profile is created the sendMail
    // send res.profile-cookie();

 const {name ,email , password } = req.body;

const avatar = req.file.path

if(!avatar){
    Response(res, "avatar is Required :)" , null ,401 )
    throw new APIError("avatar is Required:)" , 402)
}

const requiredFields = ["name"  , "email" , "password"]
for(let field of requiredFields){

    if(!req.body[field]){
        unlinkSync(avatar)
        Response(res, `${field} is Required :)`, null , 402)
        throw new APIError(`${field} is Required :)` , 403)
    }
}


const zodVaidation = userSchema.safeParse({email ,password})
// console.log(zodVaidation);

if(!zodVaidation.success){
    const zodmsg  = zodVaidation.error.errors.map((z)=>z.message);
    // console.log(zodmsg);
    unlinkSync(avatar)
    Response(res ,zodmsg.toString(), null , 402 )
    throw new APIError(zodmsg.toString() , 401)
}

const findUser = await User.findOne({email})

if(findUser){
    Response(res , "User Already Exists :) , Try Another Email" , null , 400)
    unlinkSync(avatar)
    throw new APIError("User Areaady Exits", 400)
}



const avatarURL = await uploadOnCloudinary(avatar)
console.log("URL : ", avatarURL);

const createUser = await User.create({
    name , email ,password ,avatar : avatarURL
});

 const token =  await generateToken(createUser._id)

const RegisteredUser = await User.findById(createUser._id).select("-password")

const options  = {
    httpOnly : true, 
    secure : true

}

    res.status(200)
    .cookie("jwt", token)
    .json(
        new APIREsponse(" User Registered Success Fuly !!" , RegisteredUser , 201  )
    )
})

export {Register}