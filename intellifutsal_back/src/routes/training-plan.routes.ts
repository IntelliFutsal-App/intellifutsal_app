import express from "express";
import { TrainingPlanController } from "../controllers/training-plan.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const trainingPlanRouter = express.Router();
const controller = new TrainingPlanController();

trainingPlanRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], controller.findAll);
trainingPlanRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], controller.findById);
trainingPlanRouter.post("/manual", [authMiddleware, roleMiddleware(["COACH"])], controller.createManual);
trainingPlanRouter.post("/player/ai/:playerId", [authMiddleware, roleMiddleware(["COACH"])], controller.createFromAiForPlayer);
trainingPlanRouter.post("/team/ai/:teamId", [authMiddleware, roleMiddleware(["COACH"])], controller.createFromAiForTeam);
trainingPlanRouter.patch("/approve/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], controller.approve);
trainingPlanRouter.patch("/reject/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], controller.reject);
trainingPlanRouter.patch("/archive/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], controller.archive);