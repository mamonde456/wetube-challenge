import express from "express";
import {
  commentDelete,
  commentsApi,
  viewApi,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/views", viewApi);
apiRouter
  .route("/videos/:id([0-9a-f]{24})/comments")
  .post(commentsApi)
  .delete(commentDelete);

export default apiRouter;
