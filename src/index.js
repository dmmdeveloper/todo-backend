import app from "./app.js"
import dotenv from "dotenv";

dotenv.config({path:".env"})
const port = process.env.PORT || 2001

app.listen(port , ()=>{
    console.log(`=> app is listening http://localhost:${port}`);
    
} )