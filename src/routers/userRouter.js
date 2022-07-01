import express from "express";
import { deleteUser, edit } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)", edit);
userRouter.get("/:id(\\d+)/delete", deleteUser);

export default userRouter;
