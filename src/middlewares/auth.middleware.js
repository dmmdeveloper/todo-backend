import { User } from "../models/user.model.js";
import { APIError } from "../utils/apierror.utils.js";
import { Response } from "../utils/apiresponse.utils.js";
import { asyncHandler } from "../utils/asynhandler.utils.js";
import jwt from "jsonwebtoken";


export const verifyJWT  = asyncHandler( async (req , res  ,next ) =>{


    try {
        
    const token = req.cookies?.jwt;
    // console.log(req.cookies);

    if(!token){
        Response(res, "unAuthorized Request :))", null , 404 )
        throw new APIError("unAuthorized Request :))" , 404 );
    }
    const decodedToken = await jwt.verify( token, process.env.TOKEN_SECRET   )
    
    const findUser = await User.findById(decodedToken?._id);
    
    req.user = findUser;
        next();
    
    } catch (error) {
        Response(res, "Invalid Request : token " , null , 404)
        throw new APIError("Invalid Request : token" || error , 404);
    }

})