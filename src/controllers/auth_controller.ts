
import { PrismaClient, User, Role } from "@prisma/client";
import { Request, Response, NextFunction, RequestHandler } from "express";
import bcrypt from "bcrypt"
import joi from "joi";
import { generateAcessToken, generateRefreshToken, verifyRefreshToken } from "../util/jwt_utils";

const prisma = new PrismaClient();

export class AuthController {
   protected static registerSchema = joi.object({
      name: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      address: joi.string().required(),
      phone: joi.string().required(),
      role: joi.string().valid("admin", "user").required()
   });
   protected static loginSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
   });
   public static register: RequestHandler = async (req: Request, res: Response, next): Promise<void> => {

      try {
         const { name, email, password, address, phone, role } = req.body;
         const { error } = this.registerSchema.validate(req.body);
         if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
         }
         const hashedPassword = await bcrypt.hash(password, 10);
         const user = await prisma.user.create({
            data: {
               name: name,
               email: email,
               password: hashedPassword,
               phone: phone,
               role: role === "admin" ? Role.admin : Role.user,
            }
         });
         res.status(201).json({
            user_id: user.user_id,
            name:user.name,
            email: user.email,
            role: user.role,
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
         const userToken = generateAcessToken(user?.user_id, user?.role);
         const refreshToken=generateRefreshToken(user.user_id,user.role);

         res.cookie('jwt',refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7*24*60*60*1000,
         })

         res.status(200).json({
            message: "User logged in successfully",
            token: userToken,
            user: {
               id: user?.user_id,
               email: user?.email,
               role: user?.role,
            }
         });
         return;
      }
      catch (error: any) {
         console.log(error.stack);
         next(error);
      }

   }
   public static refresh :RequestHandler=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
      const cookies=req.cookies;
      if(!cookies.jwt){
         res.status(401).json({ message: 'Unauthorized' });
         return;
      }
      const refreshToken = cookies.jwt

      const decoded= verifyRefreshToken(refreshToken);
      if(!decoded){
         res.status(403).json({ message: 'Forbidden' });
         return;
      }
      const user =await prisma.user.findUnique({
         where:{
            user_id:decoded.user_id, //potentail error
         }
      });
      if(!user){
         res.status(401).json({ message: 'Unauthorized' });
         return;
      }
      const accessToken= generateAcessToken( user.user_id, user.role);

      res.json({
         token : accessToken,
      })
   }
   public static logout :RequestHandler=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
      const cookies=req.cookies;
      if(!cookies.jwt){
          res.status(204);
          return;
      }
      res.clearCookie('jwt', { httpOnly: true, sameSite: "none", secure: true });
      res.json({ message: 'Cookie cleared' });
      return;
   }
}
