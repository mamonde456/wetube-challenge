import express from "express";
import { viewApi } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/views", viewApi);

export default apiRouter;
