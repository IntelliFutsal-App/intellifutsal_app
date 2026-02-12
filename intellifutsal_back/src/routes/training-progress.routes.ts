import express from "express";
import { TrainingProgressController } from "../controllers/training-progress.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const trainingProgressRouter = express.Router();
const trainingProgressController = new TrainingProgressController();

trainingProgressRouter.get("/assignment/:assignmentId", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], trainingProgressController.findByAssignment);
trainingProgressRouter.post("/player", [authMiddleware, roleMiddleware(["PLAYER"])], trainingProgressController.createByPlayer);
trainingProgressRouter.patch("/verify/:id", [authMiddleware, roleMiddleware(["COACH"])], trainingProgressController.verifyByCoach);