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
 const avatar =  req.file?.path;
 console.log( "Avatar", avatar);
 

if(!avatar){
    Response(res , "Avatar is Required :)"  , null , 400 )
    throw new APIError("Avatar is Required :))" , 400)
}


const requiredFields = ["name"  , "email" , "password" ]
for(let field of requiredFields){

    if(!req.body[field]){
        unlinkSync(avatar)
        Response(res, `${field} is Required :)`, null , 402)
        throw new APIError(`${field} is Required :)` , 403)
    }
}


const zodVaidation = userSchema.safeParse({email ,password})
// console.log(zodVaidation);

// if(!zodVaidation.success){
//     const zodmsg  = zodVaidation.error.errors.map((z)=>z.message);
//     console.log(zodmsg);
//     unlinkSync(avatar)
//     Response(res ,zodmsg.toString(), null , 402 )
//     throw new APIError(zodmsg.toString() , 401)
// }

const findUser = await User.findOne({email})

if(findUser){
    Response(res , "User Already Exists :) , Try Another Email" , null , 400)
    unlinkSync(avatar)
    throw new APIError(` User Already Exists ${findUser} `, 400)
}
const avatarURL = await uploadOnCloudinary(avatar)
console.log("URL" , avatarURL);

const imagePlaceholder  = name.trim().slice(0,1).toUpperCase()

const createUser = await User.create({
    name , email ,password ,avatar : avatarURL
});

 const token =  await generateToken(createUser._id)

const RegisteredUser = await User.findById(createUser._id).select("-password")

if(RegisteredUser){
    // sendMail
}else{
    Response(res , "Error When Uer Creation " , null , 401)
    throw new APIError("Error When User Creation")
}

const options = {
    httpOnly: true, // Prevent access via client-side scripts
    secure: true,   // Ensures cookies are only sent over HTTPS
    sameSite: 'Strict', // Restricts cookie to same-site requests
    path: '/',      // Makes the cookie available throughout the site
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
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
export { Register  , Login , changeMode , profile}