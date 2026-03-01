import express from "express";
import { PlayerClusterController } from "../controllers/player-cluster.controller";
import { authMiddleware, coachApprovedMiddleware, roleMiddleware } from "../middlewares";


export const playerClusterRouter = express.Router();
const playerClusterController = new PlayerClusterController();

playerClusterRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], playerClusterController.findAll);
playerClusterRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], playerClusterController.findById);
playerClusterRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], playerClusterController.save);
playerClusterRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], playerClusterController.update);
playerClusterRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], playerClusterController.delete);