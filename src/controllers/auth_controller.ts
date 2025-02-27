
import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction, RequestHandler } from "express";
import bcrypt from "bcrypt"
import joi from "joi";
import { generateAcessToken, generateRefreshToken } from "../util/jwt_utils";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import upload from "../util/cloudinary-config";
import { v2 as cloudinary } from 'cloudinary';


const prisma = new PrismaClient();
dotenv.config();

const secretKey = process.env.JWT_SECRET;
const secretRefrshKey = process.env.JWT_REFRESH_SECRET;

export class AuthController {
   protected static registerSchema = joi.object({
      name: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      phone: joi.string().required(),
   });
   protected static loginSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
   });
   public static register: RequestHandler = async (req: Request, res: Response, next): Promise<void> => {

      try {
         const { name, email, password,phone } = req.body;
         const file =req.file;
         const { error } = this.registerSchema.validate(req.body);
         if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
         }
         const hashedPassword = await bcrypt.hash(password, 10);
         
          // Handle profile picture upload if a file is provided
          let profilePictureUrl = null;
          if (file) {
              try {
                  const uploadResult = await cloudinary.uploader.upload(file.path, {
                      folder: "profile_pictures"
                  });
                  profilePictureUrl = uploadResult.secure_url;
              } catch (cloudinaryError) {
                  console.error('Cloudinary upload failed:', cloudinaryError);
                  // Continue with user creation even if image upload fails
              }
          }
          

         const user = await prisma.user.create({
            data: {
               name: name,
               email: email,
               password: hashedPassword,
               phone: phone,
               profile_picture:profilePictureUrl,
            }
         });
         const userToken = generateAcessToken(user.user_id)
         console.log("register function ",userToken)
         res.status(201).json({
            user_id: user.user_id,
            name:user.name,
            email: user.email,
            token:userToken
         });
         return;
      }
      catch (error: any) {
         console.log(error);
         next(error);
      }
   }
   public static login: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email, password } = req.body;
      try {
         const { error } = this.loginSchema.validate(req.body);
         console.log('Login attempt for:', email); // Debug log
         if (error) {
            res.status(400).json({
               message: error.details[0].message
            });
            return;
         }
         const user = await prisma.user.findUnique({
            where: {
               email: email,
            },
         });
         if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
         }

         const hashedPassword = await bcrypt.compare(password, user!.password);
         console.log('Password match:', hashedPassword); // Debug log
         if (!hashedPassword) {
            res.status(422).json({
               message: "Invalid password",

            });
            return;
         }
         const userToken = generateAcessToken(user.user_id);
         console.log("userToken",userToken,user.user_id);

         res.cookie("auth_token",userToken,{
           httpOnly: true,        // Prevents JavaScript access to the cookie 
           sameSite: 'strict',    // Protection against CSRF
           maxAge:  7 * 24 * 60 * 60 * 1000,// 24 hours
           path: '/'             // Cookie is available for all paths
         });

       //  const refreshToken=generateRefreshToken(user.user_id);
        // console.log("refreshToken",refreshToken,user.user_id);

         -/*res.cookie('jwt',refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7*24*60*60*1000,
         })*/

         res.status(200).json({
            message: "User logged in successfully",
            token: userToken,
            user: {
               id: user?.user_id,
               email: user?.email,
            }
         });
         return;
      }
      catch (error: any) {
         console.log(error);
         next(error);
      }

   }
   public static refresh :RequestHandler=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try{
       const cookies=req.cookies;
      if(!cookies.jwt){
         res.status(401).json({ message: 'Unauthorized' });
         return;
      }
      const refreshToken = cookies.jwt
      console.log("refresh token",refreshToken);

      const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET) as jwt.JwtPayload;
      console.log("decoded verify refresh token", decodedRefreshToken.userId,decodedRefreshToken.role);

      if (!decodedRefreshToken || !decodedRefreshToken.userId) {
         res.status(403).json({ message: 'Forbidden' });
         return;
       }
      const user =await prisma.user.findUnique({
         where:{
            user_id:decodedRefreshToken.userId,
         }
      });
      if(!user){
         res.status(401).json({ message: 'Unauthorized' });
         return;
      }
      const accessToken= generateAcessToken(user.user_id);

      res.json({
         token : accessToken,
      });
  }catch(error){
   console.log(error);
   next(error);
  }
   }
   public static logout :RequestHandler=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
      const cookies=req.cookies;
      if(!cookies.jwt){
          res.status(204);
          return;
      }
      res.clearCookie('jwt', { httpOnly: true, sameSite: "none", secure: true });
      res.json({ message: 'Cookie cleared' });
      return;
    }
    catch(error:any){
      console.log(error);
      next(error);
    }
   }
}
