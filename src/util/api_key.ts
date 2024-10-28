import doetenv from "dotenv";
doetenv.config();
import { Request,Response,NextFunction } from "express"
 export const apiKeyAuth=(req,res,next)=>{
   const apiKey=req.header("x-api-key");
   if(!apiKey||apiKey!==process.env.API_KEY){
      return res.status(403).json({ message: 'Forbidden: Invalid API key' });  
   }
   next();
}
