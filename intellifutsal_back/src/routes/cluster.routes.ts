import express from "express";
import { ClusterController } from "../controllers/cluster.controller";
import { authMiddleware, coachApprovedMiddleware, roleMiddleware } from "../middlewares";


export const clusterRouter = express.Router();
const clusterController = new ClusterController();

clusterRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], clusterController.findAll);
clusterRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], clusterController.findById);
clusterRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], clusterController.save);
clusterRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], clusterController.update);
clusterRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"]), coachApprovedMiddleware], clusterController.delete);