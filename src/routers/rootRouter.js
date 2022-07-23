import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  read,
  text,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { uploadsFile } from "../middleware";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);
globalRouter.get("/search", search);

export default globalRouter;
