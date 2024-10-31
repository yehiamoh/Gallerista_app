
import express from "express";
import upload from "../util/cloudinary-config";
import { ensureAuthentication } from "../middleware/verify_jwt";
import { UserController } from "../controllers/user_controller";

const userRouter = express.Router();

userRouter.use(ensureAuthentication);
userRouter.get('/user/profile',UserController.getProfile);
userRouter.post('/board',upload.single('image'),UserController.addBoard);
userRouter.get('/user/:id/',UserController.getUserById);
export default userRouter;
