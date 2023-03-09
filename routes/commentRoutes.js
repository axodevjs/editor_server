import Router from "express";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth.middleware.js";
import CommentController from "../controllers/CommentController.js";

dotenv.config();

const commentRoutes = new Router();

commentRoutes.post("/", authMiddleware, CommentController.create);
commentRoutes.get(
  "/all/:id",
  authMiddleware,
  CommentController.getAllByCommitId
);

export default commentRoutes;
