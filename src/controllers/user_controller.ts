import { PrismaClient } from "@prisma/client";
import { Request,Response,NextFunction, RequestHandler } from "express";

import joi from "joi";

import dotenv from "dotenv"

import upload from "../util/cloudinary-config";
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
})

const prisma =new PrismaClient();

interface AuthRequest extends Request {
   userId?: string;
 }
export class UserController{
   protected static boardSchema = joi.object({
      name: joi.string()
          .trim()
          .min(2)
          .max(100)
          .required()
          .messages({
              'string.empty': 'Name cannot be empty',
              'string.min': 'Name must be at least 2 characters long',
              'string.max': 'Name cannot exceed 100 characters',
              'any.required': 'Name is required'
          }),
      description: joi.string()
          .trim()
          .min(10)
          .max(500)
          .required()
          .messages({
              'string.empty': 'Description cannot be empty',
              'string.min': 'Description must be at least 10 characters long',
              'string.max': 'Description cannot exceed 500 characters',
              'any.required': 'Description is required'
          }),
      price: joi.number()
          .positive()
          .precision(2)
          .min(0)
          .max(10000)
          .required()
          .messages({
              'number.positive': 'Price must be a positive number',
              'number.min': 'Price must be at least 0',
              'number.max': 'Price cannot exceed 10,000',
              'any.required': 'Price is required',
              'number.base': 'Price must be a valid number'
          })
  });
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
         const userID=req.params.id ;
         if(!userID){
            res.status(401).json({
               message:"un authorized",
            });
            return;
         }

         const user=await prisma.user.findUnique({
            where:{
               user_id:userID
            },
            include:{
               boards:true,
            }
         });
         if(!user){
            res.status(404).json({
               message:"user not found"
            });
            return;
         }
         res.status(200).json({
            message:"user retrived sucessfully",
            user: {
               user_id: user.user_id,
               name: user.name,
               email: user.email,
               phone: user.phone,
               boards: user.boards.map(board => ({
                   Board_id: board.Board_id,
                   name: board.name,
                   image_url: board.image_url,
                   description: board.description,
                   price: board.price,
                   created_at: board.created_at,
               }))
           }
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
            },
            include:{
               boards:true
            }
         });
         console.log(user);
         if(!user){
            res.status(404).json({
               message:"user not found"
            });
         }
         res.status(200).json({
            message:"user retrived sucessfully",
            user: {
               user_id: user.user_id,
               name: user.name,
               email: user.email,
               phone: user.phone,
               profile_picture:user.profile_picture,
               boards: user.boards.map(board => ({
                   Board_id: board.Board_id,
                   name: board.name,
                   image_url: board.image_url,
                   description: board.description,
                   price: board.price,
                   created_at: board.created_at,
               }))
           }
         });
         return;
      }
      catch(error:any){
         console.log(error);
         next(error);
      }
   }
   public static updateProfile:RequestHandler=async(req:AuthRequest,res:Response,next:NextFunction):Promise<void>=>{
      try{
         const userId =req.userId;
         if(!userId){
            res.status(401).json({
               message:"Un Authorized",
            });
            return;
         }
         const {profile_picture,name,phone}=req.body;
         const user =await prisma.user.findUnique({
            where:{
               user_id:userId
            }
         });
         if(!user){
            res.status(404).json({
               message:"user not found"
            });
            return;
         }


      }
      catch(error:any){
         console.log(error);
         next(error);
      }
   }
}