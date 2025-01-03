import { Router } from "express";
import { Register } from "../controllers/user.controoler.js";


const userRouter = Router();


userRouter.route("/register").post(Register)

export default userRouter;