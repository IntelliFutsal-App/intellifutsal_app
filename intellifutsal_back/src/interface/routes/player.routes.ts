import express from "express";
import { PlayerController } from '../controllers/player.controller';
import { authMiddleware, coachApprovedMiddleware, roleMiddleware } from '../middlewares';


export const playerRouter = express.Router();
const playerController = new PlayerController();

playerRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"]), coachApprovedMiddleware], playerController.findAll);
playerRouter.get("/inactive", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"]), coachApprovedMiddleware], playerController.findAllIncludingInactive);
playerRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"]), coachApprovedMiddleware], playerController.findById);
playerRouter.get("/inactive/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"]), coachApprovedMiddleware], playerController.findByIdIncludingInactive);
playerRouter.get("/team/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"]), coachApprovedMiddleware], playerController.findByTeamId);
playerRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN", "PLAYER"])], playerController.save);
playerRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"]), coachApprovedMiddleware], playerController.update);
playerRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], playerController.delete);
playerRouter.patch("/status/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"]), coachApprovedMiddleware], playerController.updateStatus);