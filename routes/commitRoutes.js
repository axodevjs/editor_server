import Router from "express";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth.middleware.js";
import CommitController from "../controllers/CommitController.js";

dotenv.config();

const commitRoutes = new Router();

commitRoutes.post("/", authMiddleware, CommitController.create);
commitRoutes.get("/:id", authMiddleware, CommitController.getOne);
commitRoutes.put("/:id", authMiddleware, CommitController.update);
commitRoutes.get(
  "/all/:id",
  authMiddleware,
  CommitController.getAllByDocumentId
);

export default commitRoutes;
