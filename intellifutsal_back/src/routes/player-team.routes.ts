import express from "express";
import { PlayerTeamController } from "../controllers/player-team.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const playerTeamRouter = express.Router();
const playerTeamController = new PlayerTeamController();

playerTeamRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], playerTeamController.findAll);
playerTeamRouter.get("/inactive", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], playerTeamController.findAllIncludingInactive);
playerTeamRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], playerTeamController.findById);
playerTeamRouter.get("/inactive/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], playerTeamController.findByIdIncludingInactive);
playerTeamRouter.get("/player/:playerId", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], playerTeamController.findByPlayerId);
playerTeamRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], playerTeamController.save);
playerTeamRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], playerTeamController.update);
playerTeamRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], playerTeamController.delete);
playerTeamRouter.patch("/status/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], playerTeamController.updateStatus);