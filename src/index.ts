
import express from"express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import authRouter from "./routes/auth_routes";
import errorHandler from "./services/error_handler";
import {apiKeyAuth} from "./util/api_key"
dotenv.config();

const port =process.env.PORT||8080;


      const app=express();
      app.get('/',(req,res)=>{
         res.json({
            message:"tst vercel "
         })
      })
      app.use(bodyParser.json());
      app.get('/api/V0/dummy',(req,res)=>{
         res.json({
            message:"tst1"
         });
      });
      app.use("/api/V0",apiKeyAuth,authRouter);
      app.use(errorHandler);
      app.listen(port,()=>{
         console.log(`server is running on port : ${port}`)
      });
export default app;
