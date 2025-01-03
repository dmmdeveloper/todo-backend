import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express()

// App Configuration

app.use(express.json({limit:"200kb"}));
app.use(express.urlencoded({limit:"200kb" , extended:true}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors());


// Routes importing



// Routes Declaration

app.use("/" , `<h1> Hello Dost Muhammad Hi!</h1>`)



export default app;