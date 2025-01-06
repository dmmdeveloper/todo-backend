import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express()

// App Configuration

app.use(express.json({limit:"200kb"}));
app.use(express.urlencoded({limit:"200kb" , extended:true}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({
    
    // origin:"http://localhost:5173",
    origin:"https://todo-henna-psi.vercel.app",
credentials:true,
methods :["POST" , "GET" , "DELETE"]
}));


// Routes importing
import userRouter from "./routes/user.routes.js";


// Routes Declaration
app.get("/" , (req,res)=>{
    res.send(`<h1> Hello Dear Dost Muhammad Malhoo </h1>`)
})
app.use("/user", userRouter)


export default app;