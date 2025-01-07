import { Todo } from "../models/todo.model.js";
import { APIError } from "../utils/apierror.utils.js";
import { APIREsponse, Response } from "../utils/apiresponse.utils.js";
import { asyncHandler } from "../utils/asynhandler.utils.js";


const create = asyncHandler ( async ( req , res)=>{

    console.log(req.url);


    const  {  text , completed } = req.body;    
    const todo = new Todo({
        text , 
        completed , 
        createdBy : req?.user?._id
    });

    const createdTodo =   await todo.save()

    if(!createdTodo){
        Response(res, "Error When Todo Created :)", null ,400)
        throw new APIError("Error When Todo Created :)" , 400)
    }
    res
    .status(200)
    .json(
        new APIREsponse("Todo Created Success Fully !!!" , createdTodo , 200)
    )
    
})


const todos = asyncHandler( async (req , res) =>{

    // console.log(req.url);

    const todos = await Todo.find();
    // console.log(todos);

    res.status(200)
    .json(
        new APIREsponse(`Todo Fetched Success Fully !! Total : ${todos.length} `, todos , 2000 )
    )
});

const deleteTodo = asyncHandler( async (req , res)=>{
    console.log(req.url) ;
await Todo.findByIdAndDelete(req?.params?.id);

    res
    .status(200)
    .json(
        new APIREsponse("Todo Deleted Success Fully " , {} , 200)
    )
    
});
const update = asyncHandler( async (req ,res) =>{
    console.log(req.url);



    res
    .status(200)
    .json(
        new APIREsponse("Todo Updated Completed !!" , { }, 200)
    )
    
} )

export {create,todos,deleteTodo ,update }