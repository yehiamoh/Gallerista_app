
import express from "express";

import { ensureAuthentication } from "../middleware/verify_jwt";
import { UserController } from "../controllers/user_controller";

const userRouter = express.Router();



userRouter.get('/user/:id',UserController.getUserById);
userRouter.get('/user/profile',ensureAuthentication,UserController.getProfile);
userRouter.post("/protected",(req,res)=>{
   res.json("welcome to protected route")
}); 


export default userRouter;
