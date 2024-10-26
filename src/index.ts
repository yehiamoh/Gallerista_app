
import express from"express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import authRouter from "./routes/auth_routes";
import errorHandler from "./services/error_handler";

dotenv.config();

const port =process.env.PORT||8080;


      const app=express();
      app.use(bodyParser.json());
      app.use("/api/V0",authRouter);
      app.get('/api/V0/dummy',(req,res)=>{
         res.json({
            message:"for fady"
         });
      })



      app.use(errorHandler);
      app.listen(port,()=>{
         console.log(`server is running on port : ${port}`)
      });
   
export default app;
