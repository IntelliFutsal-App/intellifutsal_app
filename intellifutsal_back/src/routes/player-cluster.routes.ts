import express from "express";
import { PlayerClusterController } from "../controllers/player-cluster.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const playerClusterRouter = express.Router();
const playerClusterController = new PlayerClusterController();

playerClusterRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], playerClusterController.findAll);
playerClusterRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], playerClusterController.findById);
playerClusterRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], playerClusterController.save);
playerClusterRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], playerClusterController.update);
playerClusterRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], playerClusterController.delete);