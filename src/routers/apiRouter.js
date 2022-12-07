import express from "express";
import { laterVideoApi } from "../controllers/userController";
import {
  commentDelete,
  commentsApi,
  feedbackApi,
  viewApi,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/views", viewApi);
apiRouter.post("/videos/:id([0-9a-f]{24})/feedback", feedbackApi);
apiRouter.post("/users/:id([0-9a-f]{24})/latervideo", laterVideoApi);

apiRouter
  .route("/videos/:id([0-9a-f]{24})/comments")
  .post(commentsApi)
  .delete(commentDelete);

export default apiRouter;
