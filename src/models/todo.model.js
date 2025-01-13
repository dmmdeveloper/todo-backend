import mongoose from "mongoose"

const todoSchema = new mongoose.Schema( {
    
text: {
    type  :String , 
    required : true,
},
completed: {
    type  :Boolean , 
    required : true,
    default : false,
},
createdBy :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
}
},{ timestamps:true})

 export const Todo = mongoose.model("Todo",  todoSchema)