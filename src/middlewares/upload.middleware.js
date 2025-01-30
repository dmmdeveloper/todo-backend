import multer from "multer";
import os from "node:os"

// Multer Configuration 


const storage = multer.diskStorage({
    destination : function (req , _ , cb) {
        const tmpDir  = os.tmpdir();
        cb(null , tmpDir)        
    },
    filename : function (req , file , cb) {
        cb(null , file.originalname)   
    }
    
});



export const upload = multer({storage})