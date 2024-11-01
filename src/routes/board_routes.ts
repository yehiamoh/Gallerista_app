import express from "express";
import {BoardController} from "../controllers/board_controller";
import upload from "../util/cloudinary-config";
import { ensureAuthentication } from "../middleware/verify_jwt";

const boardRouter = express.Router();


boardRouter.post('/board',ensureAuthentication,upload.single('image'),BoardController.addBoard);
boardRouter.get('/board/:id',BoardController.getBoardByID);

export default boardRouter
