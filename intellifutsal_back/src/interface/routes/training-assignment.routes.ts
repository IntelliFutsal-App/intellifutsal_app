import express from "express";
import { TrainingAssignmentController } from '../controllers/training-assignment.controller';
import { authMiddleware, coachApprovedMiddleware, roleMiddleware } from '../middlewares';


export const trainingAssignmentRouter = express.Router();
const trainingAssignmentController = new TrainingAssignmentController();

trainingAssignmentRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN"])], trainingAssignmentController.findAll);
trainingAssignmentRouter.get("/player/me", [authMiddleware, roleMiddleware(["PLAYER"])], trainingAssignmentController.findMyAssignments);
trainingAssignmentRouter.get("/team/:teamId", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], trainingAssignmentController.findByTeam);
trainingAssignmentRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], trainingAssignmentController.findById);
trainingAssignmentRouter.post("/", [authMiddleware, roleMiddleware(["COACH"]), coachApprovedMiddleware], trainingAssignmentController.create);
trainingAssignmentRouter.patch("/activate/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], trainingAssignmentController.activate);
trainingAssignmentRouter.patch("/cancel/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], trainingAssignmentController.cancel);