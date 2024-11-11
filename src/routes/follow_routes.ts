import express from "express";
import { ensureAuthentication } from "../middleware/verify_jwt";
import { FollowController } from "../controllers/follow_controller";

const followRouter = express.Router();

followRouter.get('/follow',ensureAuthentication,FollowController.getAllFollowers)
followRouter.get('/follow/:id',ensureAuthentication,FollowController.follow);
followRouter.delete('/follow/:id/',ensureAuthentication,FollowController.unFollow);
export default followRouter;