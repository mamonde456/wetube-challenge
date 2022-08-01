import express from "express";
import {
  deleteUser,
  getEditProfile,
  getPassword,
  logout,
  postEditProfile,
  postPassword,
  userGithubFinish,
  userGithubStart,
} from "../controllers/userController";
import { protectMiddleware, publicMiddleware } from "../middleware";

const userRouter = express.Router();

userRouter
  .route("/profile")
  .all(protectMiddleware)
  .get(getEditProfile)
  .post(postEditProfile);
userRouter
  .route("/change-password")
  .all(protectMiddleware)
  .get(getPassword)
  .post(postPassword);
userRouter.get("/logout", logout);
userRouter.get("/:id(\\d+)/delete", deleteUser);
userRouter.get("/github/start", publicMiddleware, userGithubStart);
userRouter.get("/github/finish", publicMiddleware, userGithubFinish);

export default userRouter;
