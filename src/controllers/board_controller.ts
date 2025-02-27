import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction, RequestHandler } from "express";

import joi from "joi";

import dotenv from "dotenv";

import { dominantColor } from "../util/extract_dominant_color";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
}
export class BoardController {
  protected static boardSchema = joi.object({
    name: joi.string().trim().min(2).max(100).required().messages({
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name cannot exceed 100 characters",
      "any.required": "Name is required",
    }),
    description: joi.string().trim().min(10).max(500).required().messages({
      "string.empty": "Description cannot be empty",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description cannot exceed 500 characters",
      "any.required": "Description is required",
    }),
    price: joi
      .number()
      .positive()
      .precision(2)
      .min(0)
      .max(10000)
      .required()
      .messages({
        "number.positive": "Price must be a positive number",
        "number.min": "Price must be at least 0",
        "number.max": "Price cannot exceed 10,000",
        "any.required": "Price is required",
        "number.base": "Price must be a valid number",
      }),
  });
  public static addBoard: RequestHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, description, price } = req.body;
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      const { error } = this.boardSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          error: error.details[0].message,
        });
        return;
      }
      const userID = req.userId;
      if (!userID) {
        res.status(401).json({
          message: "Unauthorized",
        });
        return;
      }
      const upload = await cloudinary.uploader.upload(file.path, {
        folder: "board_images",
      });
      const image= await prisma.boardImage.create({
        data:{
          image_url:upload.secure_url,
          heigth:upload.height,
          width:upload.width,
          dominantColor:await dominantColor(upload.secure_url)
        }
      })
      const board = await prisma.board.create({
        data: {
          author_id: userID,
          description: description,
          name: name,
          price: parseFloat(price),
          image_id:image.image_id,
        },
      });

      if (!board) {
        res.status(400).json({
          message: "Cannot create a board",
        });
      }
      res.status(201).json({
        message: "Board created successfully",
        board: {
          Board_id: board.Board_id,
          name: board.name,
          image_url: image.image_url,
          description: board.description,
          price: board.price,
        },
      });
      return;
    } catch (error: any) {
      console.log(error);
      next(error);
    }
  };
  public static getBoardByID: RequestHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const boardId = req.params.id;
      if (!boardId) {
        res.status(401).json({
          message: "Un Authorized",
        });
        return;
      }
      const board = await prisma.board.findUnique({
        where: {
          Board_id: boardId,
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
              profile_picture: true,
              boards: true,
            },
          },
          image:{
            select:{
              image_url:true,
              dominantColor:true,
              width:true,
              heigth:true,
            }
          }
        },
      });

      if (!board) {
        res.status(404).json({
          message: "board not found",
        });
        return;
      }

      res.status(200).json({
        message: "Board retrieved successuflly",
        board,
      });
      return;
    } catch (error: any) {
      console.log(error);
      next(error);
    }
  };
  public static getAllBoards: RequestHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const boards = await prisma.board.findMany({
        select: {
          Board_id: true,
          name:true,
          image_id: true,
          description: true,
          price: true,
          author: {
            select: {
              user_id: true,
              email: true,
              name: true,
              profile_picture: true,
            },
          },
          image:{
            select:{
              image_url:true,
              dominantColor:true,
              width:true,
              heigth:true,
            }
          }
        },
        orderBy: {
          created_at: "desc",
        },
      });

      if (!boards.length) {
        res.status(404).json({ message: "No boards found" });
        return;
      }
      res.status(200).json({
        count: boards.length,
        boards: boards,
      });
      return;
    } catch (error: any) {
      console.log(error);
      next(error);
    }
  };
/*  public static getAllBoards2: RequestHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const boards = await prisma.board.findMany({
        select: {
          Board_id: true,
          name:true,
          image_url: true,
          description: true,
          price: true,
          author: {
            select: {
              user_id: true,
              email: true,
              name: true,
              profile_picture: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      if (!boards.length) {
        res.status(404).json({ message: "No boards found" });
        return;
      }

      const boardsWithDominantColor= await Promise.all(
        boards.map(async board => ({
          board_id: board.Board_id,
          name: board.name,
          image_url: board.image_url,
          dominant_color:await dominantColor(board.image_url),
          description: board.description,
          price: board.price,
          author: {
            user_id: board.author.user_id,
            email: board.author.email,
            name: board.author.name,
            profile_picture: board.author.profile_picture,
          },
        })),
      )
      res.status(200).json({
        count: boards.length,
        boards:boardsWithDominantColor,
        
      });
      return;
    } catch (error: any) {
      console.log(error);
      next(error);
    }
  };*/
  public static saveBoard:RequestHandler=async(req:AuthRequest,res:Response,next:NextFunction)=>{
    try{
      const boardId=req.params.id;
      const userId=req.userId;
      if(!boardId){
        res.status(422).json({
          error:"Board Id needed"
        });
        return;
      }
      if(!userId){
        res.status(422).json({
          error:"User Id needed"
        });
        return;
      }

      const existingSave =await prisma.savedBoard.findUnique({
        where:{
          user_id_board_id: {
            user_id: userId,
            board_id: boardId,
          },
        }
      });

      if (existingSave) {
         res.status(409).json({
          error: "You have already saved this board",
        });
        return;
      }

      const save= await prisma.savedBoard.create({
        data:{
          user_id:userId,
          board_id:boardId,
        }
      });

      if(!save){
        res.status(400).json({
          error:"Failed to save the post"
        });
        return;
      }
      res.status(201).json({
        message:"Board Saved Successfully",
        save
      });
      return;
    }
    catch(error:any){
      console.log(error);
      next(error);
    }
  }
  public static getSavedBoards:RequestHandler =async(req:AuthRequest,res:Response,next:NextFunction)=>{
    try{
      const userId=req.userId;
      if(!userId){
        res.status(422).json({
          error:"User Id is required"
        });
      }

      const savedBoards =await prisma.user.findUnique({
        where:{
          user_id:userId
        },
        select:{
          user_id:true,
          name:true,
          profile_picture:true,
          saved_board:{
            include:{
              board:{
                include:{
                  author:{
                    select:{
                      user_id:true,
                      name:true,
                      profile_picture:true,
                    }
                  },
                  image:{
                    select:{
                      image_url:true,
                      dominantColor:true,
                      width:true,
                      heigth:true,
                    }
                  }
                }
              },
              
            }
          },
        }
      });

      if(!savedBoards || savedBoards.saved_board.length===0){
        res.status(404).json({
          error:"cannot find user saved boards"
        });
        return;
      }
      res.status(200).json({
        user_id: savedBoards.user_id,
        user_name: savedBoards.name,
        profile_picture: savedBoards.profile_picture,
        saved_boards: savedBoards.saved_board.map((savedBoard) => ({
        board_id: savedBoard.board.Board_id,
        name: savedBoard.board.name,
        //image_url: savedBoard.board.image_url,
        description: savedBoard.board.description,
        price: savedBoard.board.price,
        created_at: savedBoard.board.created_at,
        updated_at: savedBoard.board.updated_at,
        image:{
          image_url:savedBoard.board.image.image_url,
          dominant_color:savedBoard.board.image.dominantColor,
          width:savedBoard.board.image.width,
          height:savedBoard.board.image.heigth,
        },
        author: {
          author_id: savedBoard.board.author.user_id,
          name: savedBoard.board.author.name,
          profile_picture: savedBoard.board.author.profile_picture,
        },
      })),
      });
      return;
    }
    catch(error:any){
      console.log(error);
      next(error);
    }
  }
  public static unSaveBoard:RequestHandler=async(req:AuthRequest,res:Response,next:NextFunction)=>{
    try{
      const boardId=req.params.id;
      const userId=req.userId;
      if(!boardId){
        res.status(422).json({
          error:"Board Id needed"
        });
        return;
      }
      if(!userId){
        res.status(422).json({
          error:"User Id needed"
        });
        return;
      }

      const existingSave =await prisma.savedBoard.findUnique({
        where:{
          user_id_board_id: {
            user_id: userId,
            board_id: boardId,
          },
        }
      });

      if (!existingSave) {
         res.status(409).json({
          error: "You havenot saved this board",
        });
        return;
      }

      const unSave= await prisma.savedBoard.delete({
        where:{
          user_id_board_id:{
            user_id:userId,
            board_id:boardId
          }
        }
      });

      if(!unSave){
        res.status(400).json({
          error:"Failed to unsave the post"
        });
        return;
      }
      res.status(200).json({
        message:"Board unSaved Successfully",
      });
      return;
    }
    catch(error:any){
      console.log(error);
      next(error);
    }
  }
  public static deleteBoard:RequestHandler=async (req:AuthRequest,res:Response,next:NextFunction) => {
    try{
      const boardId=req.params.id;
      const userId=req.userId;
      if(!boardId){
        res.status(422).json({
          error:"Board Id needed"
        });
        return;
      }
      if(!userId){
        res.status(422).json({
          error:"User Id needed"
        });
        return;
      }

      const board=await prisma.board.findUnique({
        where:{
          Board_id:boardId,
        },
        select:{
          author_id:true,
        }
      });

      if(!board){
        res.status(400).json({
          error:"Board not found"
        });
        return;
      }
      if(userId!==board.author_id){
        res.status(401).json({
          error:"You do not have permission to delete this board"
        });
        return;
      }
      await prisma.board.delete({
        where:{
          Board_id:boardId,
        }
      });
      res.status(200).json({
        error:"Board deleted"
      });
      return;
    }
    catch(error:any){
      console.log(error);
      next(error);
    }
  }
}
