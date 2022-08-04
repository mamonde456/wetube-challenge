import express from "express";
import {
  deleteUser,
  getEditProfile,
  getPassword,
  logout,
  postEditProfile,
  postPassword,
  profile,
  userGithubFinish,
  userGithubStart,
} from "../controllers/userController";
import {
  protectMiddleware,
  publicMiddleware,
  uploadsAvatar,
} from "../middleware";

const userRouter = express.Router();

userRouter.get("/:id([0-9a-f]{24})", profile);
userRouter
  .route("/:id([0-9a-f]{24})/edit-profile")
  .all(protectMiddleware)
  .get(getEditProfile)
  .post(uploadsAvatar.single("avatar"), postEditProfile);
userRouter
  .route("/change-password")
  .all(protectMiddleware)
  .get(getPassword)
  .post(postPassword);
userRouter.get("/logout", logout);
userRouter.get("/:id([0-9a-f]{24})/delete", deleteUser);
userRouter.get("/github/start", publicMiddleware, userGithubStart);
userRouter.get("/github/finish", publicMiddleware, userGithubFinish);

export default userRouter;
