import express from "express";
import { CoachController } from "../controllers/coach.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const coachRouter = express.Router();
const coachController = new CoachController();

coachRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachController.findAll);
coachRouter.get("/inactive", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachController.findAllIncludingInactive);
coachRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachController.findById);
coachRouter.get("/inactive/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachController.findByIdIncludingInactive);
coachRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachController.save);
coachRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachController.update);
coachRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], coachController.delete);
coachRouter.patch("/status/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], coachController.updateStatus);