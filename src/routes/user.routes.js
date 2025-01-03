import { Router } from "express";
import { Register } from "../controllers/user.controoler.js";
import { upload } from "../middlewares/upload.middleware.js";


const userRouter = Router();


userRouter.route("/register").post( upload.single("avatar"), Register)

export default userRouter;