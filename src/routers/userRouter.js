import express from "express";
import {
  deleteUser,
  getEditProfile,
  postEditProfile,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter
  .route("/:id([0-9a-f]{24})/profile")
  .get(getEditProfile)
  .post(postEditProfile);
userRouter.get("/:id(\\d+)/delete", deleteUser);

export default userRouter;
