import express from "express";
import { ClusterController } from "../controllers/cluster.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const clusterRouter = express.Router();
const clusterController = new ClusterController();

clusterRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], clusterController.findAll);
clusterRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], clusterController.findById);
clusterRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], clusterController.save);
clusterRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], clusterController.update);
clusterRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], clusterController.delete);