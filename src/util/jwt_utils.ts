import dotenv from "dotenv"
import jwt from "jsonwebtoken";
dotenv.config();
const secretKey = process.env.JWT_SECRET;
const secretRefrshKey = process.env.JWT_REFRESH_SECRET;


export const generateAcessToken=(userId:string|undefined,role:string|undefined)=>{
 
   return jwt.sign({userId:userId,role:role},secretKey,{expiresIn:'3m'})
}
export const generateRefreshToken=(userId:string|undefined,role:string|undefined)=>{
 
   return jwt.sign({userId:userId,role:role},secretRefrshKey,{expiresIn:'60d'})
}

