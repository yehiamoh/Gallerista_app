
import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET

export const genertaeToken=(userId:string|undefined,role:string|undefined)=>{
   const payLoad={
      userId,
      role,
   }
   return jwt.sign({payLoad},secretKey,{expiresIn:'1h'})
}

export const verifyToken = (token: string) => {
   return jwt.verify(token, secretKey);
};
