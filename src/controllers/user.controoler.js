import { APIError } from "../utils/apierror.utils.js";
import { APIREsponse, Response } from "../utils/apiresponse.utils.js";
import { asyncHandler } from "../utils/asynhandler.utils.js";
import {unlinkSync , readFile } from "node:fs"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/uploadonCloudinary.utils.js";
import { sendEmail } from "../utils/sendmail.utils.js";

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


 const requiredFields = ["name"  , "email" , "password" ]
 for(let field of requiredFields){
     if(!req.body[field]){
         Response(res, `${field} is Required :)`, null , 402)
         throw new APIError(`${field} is Required :)` , 403)
     }
 }
 


 let avatar;
console.log( "Avatar", avatar);



if(req.file){
    avatar = await uploadOnCloudinary(req.file?.path);
}else{
const firstLetter = name.trim().slice(0,1).toUpperCase(); 
avatar = `https://placehold.co/600x400/edb64a/FFFFFF/png?text=${firstLetter}`;
}
 

const findUser = await User.findOne({email})


if(findUser){
    Response(res , "User Already Exists :) , Try Another Email" , null , 400)
    if(req.file){
        unlinkSync(avatar)
    }
    throw new APIError(` User Already Exists ${findUser} `, 400)
}

const createUser = await User.create({
    name , email ,password ,avatar
});

const token =  await generateToken(createUser._id)

const RegisteredUser = await User.findById(createUser._id).select("-password")

const emailRecipt = `


<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Todo App</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #2C8FFF; color: white;">
        <tr>
            <td align="center" style="padding: 20px;">
                <img src="https://res.cloudinary.com/dtqli9uge/image/upload/v1736495904/gkolox3cbymrxluapqs8.png" alt="Todo App Logo" style="width: 100px; height: auto; border-radius: 50%; margin-bottom: 15px;">
                 <h1>My Todos</h1>
                <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Welcome to Todo App!</h1>
                <p style="margin: 10px 0; font-size: 18px;">Your ultimate task management tool</p>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 20px;">
                <!-- Message -->
                <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                    Hi ${name},
                </p>
                <p style="margin: 10px 0; font-size: 16px; line-height: 1.6;">
                    Thank you for registering with Todo App. We're excited to have you on board! With Todo App, you can organize your tasks, set reminders, and achieve your goals effortlessly.
                </p>
                <p style="margin: 10px 0; font-size: 16px; line-height: 1.6;">
                    Below are your registration details:
                </p>
                <!-- User Information -->
                <table align="center" cellpadding="10" cellspacing="0" width="100%" style="max-width: 500px; color: white; border: 1px solid #ffffff; margin-top: 15px;">
                    <tr>
                        <td style="font-weight: bold;">Name:</td>
                        <td>${name}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">Email:</td>
                        <td>${email}</td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 20px;">
                <!-- Button -->
                <a href="https://todoapp.com/dashboard" style="display: inline-block; padding: 12px 24px; background-color: white; color: #2C8FFF; text-decoration: none; font-size: 16px; border-radius: 5px; font-weight: bold; margin-top: 10px;">Go to Your Dashboard</a>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 20px;">
                <!-- Footer -->
                <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                    Need help? Contact us at <a href="mailto:support@todoapp.com" style="color: white; text-decoration: underline;">dostm786@gmail.com</a>
                </p>
                <p style="margin: 10px 0; font-size: 14px; line-height: 1.6;">
                    &copy; 2025 Todo App. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
`
await sendEmail(email, "AlhamdUllah MERN Todo App ", " ", emailRecipt)

if(RegisteredUser){
    // sendMail
}else{
    Response(res , "Error When Uer Creation " , null , 401)
    throw new APIError("Error When User Creation")
}



const options = {
    httpOnly: true, 
    secure: true,   
    sameSite :"none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie lifespan (1 week)
};
    res.status(200)
    .cookie("jwt", token ,options )
    .json(
        new APIREsponse(" User Registered Success Fuly !!" , RegisteredUser , 201  )
    )
})


const Login  = asyncHandler ( async (req  , res) =>{


    console.log(req.url);

    // get data 
    // empty validation
    // findUser
    // check password - compare 
    // token
    // return res - cookie

const  {email , password } = req.body;
console.log(email , password);

const requiredFields = ["email", "password"]

for( let field of requiredFields){
    if(!req.body[field]){
        Response(res , `${field} is Required :))`, null , 400)
        throw new APIError(`${field} is Requied :)`, 400)
    }
}

const findUser = await User.findOne({email})
// console.log(findUser);

if(!findUser){
    Response(res, "User Not Registered" , null , 400)
    throw new APIError("User Not Regitered " , 400)
}


const isPasswordValid = await findUser.isPasswordCorrect(password)
console.log(isPasswordValid);

if(!isPasswordValid){
    Response(res ,"Invalid Password :)", null , 400)
    throw new APIError("Invalid Password" , 400 )
}
const token = await generateToken (findUser?._id)
console.log(token);

const LoggedInUser = await User.findById(findUser?._id).select("-password")

const options = {
        httpOnly: true, 
        secure: true,   
        sameSite :"none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie lifespan (1 week)
    };

    res
    .status(200)
    .cookie("jwt",token ,options)
    .json(
        new APIREsponse("User Logged In Success Fully !!!" , LoggedInUser,200 ) 
    )
})

const Logout  = asyncHandler ( async (req , res)=>{
    console.log(req.url);

console.log(req.user);

// update token id Db = ""
// crerCookie 

const logOutUser = await User.findByIdAndUpdate(req?.user?._id  , {
    $unset :{
        token : ""
    }
}  , { new : true})


const options = {
    httpOnly: true , 
    secure : true
}

    res
    .status(200)
    .clearCookie("jwt" , options)
    .json(
        new APIREsponse("User Logout Success Fully !!" , { } , 200)  
    )
    
})


const changeMode = asyncHandler(  async (req ,res) =>{
    console.log(req.url);
const mode = req.body.mode;

const chnagedProfile = await User.findByIdAndUpdate(req?.user?._id , { 
mode
}
     , { new :true} ).select("-password") ;//;; 

    res
    .status(200)
    .json(
        new APIREsponse("User Mode Changed :))" , chnagedProfile, 200 )
    )    
})


const profile = asyncHandler(async (req , res)=>{
    console.log(req.url);

res.status(200)
.json(
    new APIREsponse("User Fetched Success Fully !!" , req.user  ,200 )
)
})

const updateProfile = asyncHandler ( async (req , res) =>{
    console.log(req.url);
    // get id from re.user?._id;
    // get Data text - data
    // get img
    // upload on cloudinary
    // create object of providedFileds
    // destruce in the finByIdAndUpdate()
    // resturn res

console.log(req?.user?._id);
const  { name , email , password } = req.body; 
// newProfile
console.log("Files" , req.file);

let  avatar;
if(req.file){
    avatar = await uploadOnCloudinary( req.file.path); 
    
}else{
    avatar=null;
}

const findUser = await User.findById(req?.user?._id);

if(name) findUser.name = name;
if(email) findUser.email = email ;
if(password) findUser.password = password;
if(avatar) findUser.avatar = avatar;



const savedUse = await findUser.save();

res
    .status(200)
    .json(
        new APIREsponse("Profile Updated Success Fully !!" ,savedUse , 201)
    )  
})


export { Register  , Login , changeMode , profile , Logout , updateProfile}