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
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing"
      });
    }

    // Check for Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format. Use 'Bearer <token>'"
      });
    }

    // Extract token without 'Bearer ' prefix
    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const decodedAccessToken = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

    if (!decodedAccessToken.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
    }

    req.userId = decodedAccessToken.userId;
    next();
    
  } catch (error) { // handel each case of the errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token has expired"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}