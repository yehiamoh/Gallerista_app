import express from "express";
import { BoardController } from "../controllers/board_controller";
import upload from "../util/cloudinary-config";
import { ensureAuthentication } from "../middleware/verify_jwt";

const boardRouter = express.Router();

// Public routes (no authentication required)
boardRouter.get('/boards', BoardController.getAllBoards);
boardRouter.get('/board/:id', BoardController.getBoardByID);

// Protected routes (authentication required)
boardRouter.post('/board', ensureAuthentication, upload.single('image'), BoardController.addBoard);

export default boardRouter;