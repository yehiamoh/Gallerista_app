
import express from "express";
import {AuthController} from "../controllers/auth_controller";
import upload from "../util/cloudinary-config";

const authRouter = express.Router();

authRouter.post("/auth/register",upload.single("image"),AuthController.register); 
authRouter.post("/auth/login",AuthController.login); 
//authRouter.get("/auth/refresh",AuthController.refresh);
//authRouter.post("/auth/refresh",AuthController.refresh);

export default authRouter;
