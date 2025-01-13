import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema( {



name:{

    type:String ,
    trim: true,
    required : true,
},
email:{
    type:String ,
    trim: true,
    required : true,
    unique : true,
},
password:{
    type:String ,
    required : true,
},
avatar:{
    type:String },
token : String,
mode: {

    type:String ,
    enum    : ["collection" , "general"],
    default : "general"
}


} , { timestamps:true});


// hash the password
// create method of comaparing the hashed and plain password 
// generate Token


userSchema.pre("save" , async function (next) {
if(!this.isModified("password")) return next();
this.password = await bcrypt.hash(this.password , 10);
next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
return await bcrypt.compare(password , this.password)
}
userSchema.methods.generateToken = async function () {
    return jwt.sign( 
        {
            _id : this._id,
    },
    process.env.TOKEN_SECRET,
    {
        expiresIn : "10d"
    }

)
    
}
export const User = mongoose.model("User" , userSchema);