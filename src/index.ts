
import express from"express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import authRouter from "./routes/auth_routes";
import userRouter from "./routes/user_routes";
import errorHandler from "./middleware/error_handler";
import {apiKeyAuth} from "./util/api_key"
import cookieParser from "cookie-parser";
dotenv.config();

const port =process.env.PORT||8080;


      const app=express();
      app.use(cookieParser());
      app.use(bodyParser.json());
      app.get('/api/V0/dummy',(req,res)=>{
         res.json({
            message:"tst1"
         });
      });
      app.use("/api/V0/",apiKeyAuth,authRouter);
      app.use("/api/V0/",apiKeyAuth,userRouter);
      app.use(errorHandler);
export default app;