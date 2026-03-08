import { Router } from "express";
import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware, roleMiddleware } from '../middlewares';


export const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.get("/me", [authMiddleware, roleMiddleware(["ADMIN", "PLAYER", "COACH"])], profileController.getMyState);