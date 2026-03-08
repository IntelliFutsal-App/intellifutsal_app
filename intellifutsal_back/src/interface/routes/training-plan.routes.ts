import express from "express";
import { TrainingPlanController } from '../controllers/training-plan.controller';
import { authMiddleware, coachApprovedMiddleware, roleMiddleware } from '../middlewares';


export const trainingPlanRouter = express.Router();
const controller = new TrainingPlanController();

trainingPlanRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN"])], controller.findAll);
trainingPlanRouter.get("/my-plans", [authMiddleware, roleMiddleware(["COACH"]), coachApprovedMiddleware], controller.findMyPlans);
trainingPlanRouter.post("/manual", [authMiddleware, roleMiddleware(["COACH"]), coachApprovedMiddleware], controller.createManual);
trainingPlanRouter.post("/player/ai/:playerId", [authMiddleware, roleMiddleware(["COACH"]), coachApprovedMiddleware], controller.createFromAiForPlayer);
trainingPlanRouter.post("/team/ai/:teamId", [authMiddleware, roleMiddleware(["COACH"]), coachApprovedMiddleware], controller.createFromAiForTeam);
trainingPlanRouter.patch("/approve/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], controller.approve);
trainingPlanRouter.patch("/reject/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], controller.reject);
trainingPlanRouter.patch("/archive/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], controller.archive);
trainingPlanRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], controller.findById);