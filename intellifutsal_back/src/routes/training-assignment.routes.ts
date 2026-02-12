import express from "express";
import { TrainingAssignmentController } from "../controllers/training-assignment.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const trainingAssignmentRouter = express.Router();
const trainingAssignmentController = new TrainingAssignmentController();

trainingAssignmentRouter.get("/player/me", [authMiddleware, roleMiddleware(["ADMIN", "PLAYER"])], trainingAssignmentController.findMyAssignments);
trainingAssignmentRouter.get("/team/:teamId", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], trainingAssignmentController.findByTeam);
trainingAssignmentRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], trainingAssignmentController.findById);
trainingAssignmentRouter.post("/", [authMiddleware, roleMiddleware(["COACH"])], trainingAssignmentController.create);
trainingAssignmentRouter.patch("/activate/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], trainingAssignmentController.activate);
trainingAssignmentRouter.patch("/cancel/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], trainingAssignmentController.cancel);