import express from "express";
import { TeamController } from "../controllers/team.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const teamRouter = express.Router();
const teamController = new TeamController();

teamRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], teamController.findAll);
teamRouter.get("/inactive", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], teamController.findAllIncludingInactive);
teamRouter.get("/my-teams", [authMiddleware, roleMiddleware(["COACH", "PLAYER"])], teamController.findMyTeams);
teamRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], teamController.findById);
teamRouter.get("/inactive/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], teamController.findByIdIncludingInactive);
teamRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], teamController.save);
teamRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], teamController.update);
teamRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], teamController.delete);
teamRouter.patch("/status/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], teamController.updateStatus);