import express from "express";
import { JoinRequestController } from "../controllers/join-request.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const joinRequestRouter = express.Router();
const joinRequestController = new JoinRequestController();

joinRequestRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], joinRequestController.findAll);
joinRequestRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], joinRequestController.findById);
joinRequestRouter.get("/player/me", [authMiddleware, roleMiddleware(["PLAYER"])], joinRequestController.findMyRequests);
joinRequestRouter.get("/team/:teamId", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], joinRequestController.findPendingByTeam);
joinRequestRouter.post("/", [authMiddleware, roleMiddleware(["PLAYER"])], joinRequestController.create);
joinRequestRouter.patch("/cancel/:id", [authMiddleware, roleMiddleware(["PLAYER"])], joinRequestController.cancel);
joinRequestRouter.patch("/approve/:id", [authMiddleware, roleMiddleware(["COACH"])], joinRequestController.approve);
joinRequestRouter.patch("/reject/:id", [authMiddleware, roleMiddleware(["COACH"])], joinRequestController.reject);
joinRequestRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], joinRequestController.delete);