import express from "express";
import { BoardController } from "../controllers/board_controller";
import upload from "../util/cloudinary-config";
import { ensureAuthentication } from "../middleware/verify_jwt";

const boardRouter = express.Router();

// Public routes
boardRouter.route('/boards')
  .get(BoardController.getAllBoards);
boardRouter.route('/boards2')
  .get(BoardController.getAllBoards);

boardRouter.route('/board/:id')
  .get(BoardController.getBoardByID);

// Protected routes
boardRouter.route('/board')
  .post(ensureAuthentication, upload.single('image'), BoardController.addBoard);

boardRouter.route('/saveBoard')
  .get(ensureAuthentication,BoardController.getSavedBoards);

boardRouter.route('/saveBoard/:id')
  .post(ensureAuthentication,BoardController.saveBoard);

boardRouter.route('/unSaveBoard/:id')
  .delete(ensureAuthentication,BoardController.unSaveBoard);

boardRouter.route('/deleteBoard/:id')
  .delete(ensureAuthentication,BoardController.deleteBoard);



export default boardRouter;