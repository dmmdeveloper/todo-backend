import { APIREsponse } from "../utils/apiresponse.utils.js";
import { asyncHandler } from "../utils/asynhandler.utils.js";


const Register = asyncHandler( (req,res )=>{
    console.log(req.url);


    res.status(200)
    .json(
        new APIREsponse(" User Registered Success Fuly !!" , "Mash Allah" , 201  )
    )
    
})

export {Register}