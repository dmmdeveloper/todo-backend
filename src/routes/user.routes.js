import { Router } from "express";
import { Register } from "../controllers/user.controoler.js";
import { upload } from "../middlewares/upload.middleware.js";


const userRouter = Router();


userRouter.route("/register").post( upload.none(), Register)

export default userRouter;