import express from "express";
import { ensureAuthentication } from "../middleware/verify_jwt";
import { UserController } from "../controllers/user_controller";

const userRouter = express.Router();

userRouter.use(ensureAuthentication);
userRouter.get('/user/profile',UserController.getProfile);  // More specific route first
userRouter.get('/user/:id',UserController.getUserById);     // Generic parameter route second

export default userRouter;