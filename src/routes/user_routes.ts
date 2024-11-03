
import express from "express";
import upload from "../util/cloudinary-config";
import { ensureAuthentication } from "../middleware/verify_jwt";
import { UserController } from "../controllers/user_controller";

const userRouter = express.Router();

userRouter.get('/user/profile',ensureAuthentication,UserController.getProfile);
userRouter.get('/user/:id/',ensureAuthentication,UserController.getUserById);
export default userRouter;
