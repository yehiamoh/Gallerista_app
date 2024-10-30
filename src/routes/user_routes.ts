
import express from "express";

import { ensureAuthentication } from "../middleware/verify_jwt";

const userRouter = express.Router();


userRouter.use(ensureAuthentication);
userRouter.post("/protected",(req,res)=>{
   res.json("welcome to protected route")
}); 


export default userRouter;
