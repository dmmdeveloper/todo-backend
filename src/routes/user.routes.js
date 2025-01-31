import { Router } from "express";
import { changeMode, Login, Logout, profile, Register, updateProfile } from "../controllers/user.controoler.js";
import { upload } from "../middlewares/upload.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const userRouter = Router();

userRouter.route("/register").post( upload.single("avatar"), Register)
userRouter.route("/login").post( upload.none(), Login)
userRouter.route("/mode").post( verifyJWT , changeMode)
userRouter.route("/profile").get( verifyJWT, profile)
userRouter.route("/update").post( verifyJWT ,upload.single("newProfile"),updateProfile)

// Secure Routes
userRouter.route("/logout").get( verifyJWT, Logout)

export default userRouter;