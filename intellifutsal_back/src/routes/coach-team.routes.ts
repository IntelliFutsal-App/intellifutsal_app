import express from "express";
import { CoachTeamController } from "../controllers/coach-team.controller";
import { authMiddleware, coachApprovedMiddleware, roleMiddleware } from "../middlewares";


export const coachTeamRouter = express.Router();
const coachTeamController = new CoachTeamController();

coachTeamRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], coachTeamController.findAll);
coachTeamRouter.get("/inactive", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], coachTeamController.findAllIncludingInactive);
coachTeamRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], coachTeamController.findById);
coachTeamRouter.get("/inactive/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], coachTeamController.findByIdIncludingInactive);
coachTeamRouter.get("/coach/:coachId", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], coachTeamController.findByCoachId);
coachTeamRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], coachTeamController.save);
coachTeamRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], coachTeamController.update);
coachTeamRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"]), coachApprovedMiddleware], coachTeamController.delete);
coachTeamRouter.patch("/status/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], coachTeamController.updateStatus);