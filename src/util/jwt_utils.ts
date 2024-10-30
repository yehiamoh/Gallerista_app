import dotenv from "dotenv"
import jwt from "jsonwebtoken";
dotenv.config();
const secretKey = process.env.JWT_SECRET;
const secretRefrshKey = process.env.JWT_REFRESH_SECRET;


export const generateAcessToken=(userId:string|undefined,role:string|undefined)=>{
   const payLoad={
      userId,
      role,
   }
   return jwt.sign({payLoad},secretKey,{expiresIn:'1m'})
}
export const generateRefreshToken=(userId:string|undefined,role:string|undefined)=>{
   const payLoad={
      userId,
      role,
   }
   return jwt.sign({payLoad},secretRefrshKey,{expiresIn:'60d'})
}

export const verifyAccessToken = (token: string)=> {
   return jwt.verify(token, secretKey) as jwt.JwtPayload;
};
export const verifyRefreshToken = (token: string) => {
   return jwt.verify(token, secretRefrshKey) as jwt.JwtPayload;
};
