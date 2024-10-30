
import { Request,Response,NextFunction, ErrorRequestHandler } from "express";
import {isHttpError} from "http-errors";

const errorHandler:ErrorRequestHandler= (error,req:Request,res:Response,next:NextFunction)=>{
    console.log(error.stack);
    let statusCode=500;
    let errorMessage="An unknown error occurred";
    if(isHttpError(error)){
      statusCode=error.statusCode;
      errorMessage=error.erroMessage;
    }
    res.status(statusCode).json({
      message:errorMessage
    });

}
export default errorHandler;
