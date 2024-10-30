
import express from "express";

import { ensureAuthentication } from "../middleware/verify_jwt";
import { UserController } from "../controllers/user_controller";

const userRouter = express.Router();


userRouter.use(ensureAuthentication);
userRouter.get('/user/:id',UserController.getUserById);
userRouter.get('/user/profile',UserController.getProfile);

export default userRouter;
