import express from "express";
import { CoachController } from "../controllers/coach.controller";
import { authMiddleware, coachApprovedMiddleware, roleMiddleware } from "../middlewares";


export const coachRouter = express.Router();
const coachController = new CoachController();

coachRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN"])], coachController.findAll);
coachRouter.get("/inactive", [authMiddleware, roleMiddleware(["ADMIN"])], coachController.findAllIncludingInactive);
coachRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], coachController.findById);
coachRouter.get("/inactive/:id", [authMiddleware, roleMiddleware(["ADMIN"])], coachController.findByIdIncludingInactive);
coachRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachController.save);
coachRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], coachController.update);
coachRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], coachController.delete);
coachRouter.patch("/status/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"]), coachApprovedMiddleware], coachController.updateStatus);