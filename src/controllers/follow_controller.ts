import { Request,Response,NextFunction,RequestHandler} from "express"
import { PrismaClient } from "@prisma/client"
const prisma= new PrismaClient();

interface AuthRequest extends Request{
   userId?:string;
}
export class FollowController{
public static follow:RequestHandler =async(req:AuthRequest,res:Response,next:NextFunction)=>{
   try{
      const followerId=req.userId;
   if(!followerId){
      res.status(422).json({
         error:"cannot find current user id"
      });
      return;
   }
   const followedId=req.params.id;
   if(!followedId){
      res.status(422).json({
         error:"cannot find the user that will be followed"
      });
      return;
   }

   const existingFollow=await prisma.follow.findUnique({
      where:{
         follower_id_followed_id:{
            follower_id:followerId,
            followed_id:followedId
         }
      }
   });
   if(existingFollow){
      res.status(409).json({
         error:"You already Follow this user"
      });
      return;
   }
   const follow=await prisma.follow.create({
      data:{
         follower_id:followerId,
         followed_id:followedId
      }
   });
   res.status(201).json({
      message:"Follow created",
      follow
   });
   return;

   }
   catch(error:any){
      console.log(error);
      next(error);
   }
}
public static unFollow:RequestHandler =async(req:AuthRequest,res:Response,next:NextFunction)=>{
   try{
      const followerId=req.userId;
   if(!followerId){
      res.status(422).json({
         error:"cannot find current user id"
      });
      return;
   }
   const followedId=req.params.id;
   if(!followedId){
      res.status(422).json({
         error:"cannot find the user that will be followed"
      });
      return;
   }

   const existingFollow=await prisma.follow.findUnique({
      where:{
         follower_id_followed_id:{
            follower_id:followerId,
            followed_id:followedId
         }
      }
   });
   if(!existingFollow){
      res.status(409).json({
         error:"You already dont Follow this user"
      });
      return;
   }
   const follow=await prisma.follow.delete({
      where:{
         follower_id_followed_id:{
            followed_id:followedId,
            follower_id:followerId,
         }
      }
   });
   res.status(201).json({
      message:"un follow done successfully",
   });
   return;

   }
   catch(error:any){
      console.log(error);
      next(error);
   }
}
public static getAllFollowers:RequestHandler=async(req:AuthRequest,res:Response,next:NextFunction)=>{
   try{
      const followerId=req.userId;
      if(!followerId){
         res.status(422).json({
            error:"cannot find current user id"
         });
         return;
      }
      const followers = await prisma.follow.findMany({
         where: {
            follower_id: followerId 
         },
         select: {
            follower: {
               select: {
                  user_id: true,
                  name: true,
                  profile_picture:true 
               }
            }
         }
      });
      res.status(200).json({
         message:"Followers retrieved successfully",
         count:followers.length,
         followers:followers.map(f=>f.follower)
      })

   }
   catch(error:any){
      console.log(error);
      next(error);
   }
}
}