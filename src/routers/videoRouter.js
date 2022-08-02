import express from "express";
import {
  deleteVideo,
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  watch,
} from "../controllers/videoController";
import { protectMiddleware, uploadsVideo } from "../middleware";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(protectMiddleware)
  .get(getUpload)
  .post(uploadsVideo.single("video"), postUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit-video")
  .all(protectMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", protectMiddleware, deleteVideo);

export default videoRouter;
