import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  userId?: string;
}

export function ensureAuthentication(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) :void{
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
       res.status(401).json({
        success: false,
        message: "Authorization header missing"
      });
      return;
    }

    // Check for Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
       res.status(401).json({
        success: false,
        message: "Invalid token format. Use 'Bearer <token>'"
      });
      return;
    }

    // Extract token without 'Bearer ' prefix
    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const decodedAccessToken = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

    if (!decodedAccessToken.userId) {
       res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
      return;
    }

    req.userId = decodedAccessToken.userId;
    console.log("ensure auth middle ware req.userId = " ,req.userId);
    next();
    
  } catch (error) { // handel each case of the errors
    if (error instanceof jwt.JsonWebTokenError) {
       res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
       res.status(401).json({
        success: false,
        message: "Token has expired"
      });
      return
    }

     res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return;
  }
}