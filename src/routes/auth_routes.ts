
import express from "express";
import {AuthController} from "../controllers/auth_controller";

const authRouter = express.Router();

authRouter.post("/auth/register",AuthController.register); 
authRouter.post("/auth/login",AuthController.login); 
//authRouter.get("/auth/refresh",AuthController.refresh);
//authRouter.post("/auth/refresh",AuthController.refresh);

export default authRouter;
