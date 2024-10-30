import { PrismaClient } from "@prisma/client";
import { Request,Response,NextFunction, RequestHandler } from "express";


const prisma =new PrismaClient();

interface AuthRequest extends Request {
   userId?: string;
 }
export class UserController{
   public static getAllUsers:RequestHandler = async(req:AuthRequest,res:Response,next:NextFunction):Promise<void>=>{
      try{
         const users =await prisma.user.findMany();
         if(!users||users.length===0){
            res.status(404).json({
               message:"No users found"
            });
         }

         res.status(200).json({
            message:"user retrieved successfully",
            users,
         })
      }
      catch(error:any){
         console.log(error);
         next(error);
      }
   }
   public static getUserById:RequestHandler=async(req:AuthRequest,res:Response,next:NextFunction):Promise<void>=>{
      try{
         const userID=req.query.id as string;
         if(!userID){
            res.status(401).json({
               message:"un authorized",
            });
            return;
         }

         const user=await prisma.user.findUnique({
            where:{
               user_id:userID
            }
         });
         if(!user){
            res.status(404).json({
               message:"user not found"
            });
         }
         res.status(200).json({
            message:"user retrived sucessfully",
            user
         });
         return;
      }
      catch(error:any){
         console.log(error);
         next(error);
      }
   }
   public static getProfile:RequestHandler=async(req:AuthRequest,res:Response,next:NextFunction):Promise<void>=>{
      try{
         const userID=req.userId;
         console.log(userID)
         if(!userID){
            res.status(401).json({
               message:"un authorized 1",
            });
            return;
         }

         const user=await prisma.user.findUnique({
            where:{
               user_id:userID
            }
         });
         if(!user){
            res.status(404).json({
               message:"user not found"
            });
         }
         res.status(200).json({
            message:"user retrived sucessfully",
            user
         });
         return;
      }
      catch(error:any){
         console.log(error);
         next(error);
      }
   }
}