import express from "express";
import { BoardController } from "../controllers/board_controller";
import upload from "../util/cloudinary-config";
import { ensureAuthentication } from "../middleware/verify_jwt";

const boardRouter = express.Router();

// Public routes
boardRouter.route('/boards')
  .get(BoardController.getAllBoards);

boardRouter.route('/board/:id')
  .get(BoardController.getBoardByID);

// Protected routes
/*boardRouter.route('/board')
  .post(ensureAuthentication, upload.single('image'), BoardController.addBoard);*/

export default boardRouter;