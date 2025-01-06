import { Router } from "express";
import { Login, Register } from "../controllers/user.controoler.js";
import { upload } from "../middlewares/upload.middleware.js";

const userRouter = Router();

userRouter.route("/register").post( upload.single("avatar"), Register)
userRouter.route("/login").post( upload.none(), Login)

export default userRouter;