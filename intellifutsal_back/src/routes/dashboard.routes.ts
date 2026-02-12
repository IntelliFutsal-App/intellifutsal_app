import express from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const dashboardRouter = express.Router();
const dashboardController = new DashboardController();

dashboardRouter.get("/coach", [authMiddleware, roleMiddleware(["COACH"])], dashboardController.getCoachDashboard);
dashboardRouter.get("/player", [authMiddleware, roleMiddleware(["PLAYER"])], dashboardController.getPlayerDashboard);