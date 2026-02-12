import express from "express";
import { CoachTeamController } from "../controllers/coach-team.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const coachTeamRouter = express.Router();
const coachTeamController = new CoachTeamController();

coachTeamRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachTeamController.findAll);
coachTeamRouter.get("/inactive", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachTeamController.findAllIncludingInactive);
coachTeamRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachTeamController.findById);
coachTeamRouter.get("/inactive/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachTeamController.findByIdIncludingInactive);
coachTeamRouter.get("/coach/:coachId", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachTeamController.findByCoachId);
coachTeamRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachTeamController.save);
coachTeamRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachTeamController.update);
coachTeamRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], coachTeamController.delete);
coachTeamRouter.patch("/status/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachTeamController.updateStatus);