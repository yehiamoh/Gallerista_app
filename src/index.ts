
import express from"express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import authRouter from "./routes/auth_routes";
import errorHandler from "./services/error_handler";
import {apiKeyAuth} from "./util/api_key"
dotenv.config();

const port =process.env.PORT||8080;


      const app=express();
      app.use(bodyParser.json());
      app.get('/api/V0/dummy',(req,res)=>{
         res.json({
            message:"tst1"
         });
      });
      app.get('/api/V0/',(req,res)=>{
         res.json({
            from :"yehia",
            to :"fady",
         });
      });
      app.use("/api/V0/",apiKeyAuth,authRouter);
      app.use(errorHandler);
export default app;