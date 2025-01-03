import app from "./app.js";
import { DBConnection } from "./db/connection.db.js";
import dotenv from "dotenv"

dotenv.config({path:".env"})
const port = 2000;

DBConnection()
.then( ()=>{
    app.listen(port , ()=>{
        console.log(`=> app is Listening on http://localhost:${port}`);      
    })
})
.catch((er)=>console.log("ERROR On Index.js" ,err)
)