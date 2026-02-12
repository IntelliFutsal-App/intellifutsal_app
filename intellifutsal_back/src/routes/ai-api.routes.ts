import { Router } from "express";
import { AiApiController } from "../controllers/ai-api.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const aiApiRouter = Router();
const aiApiController = new AiApiController();

aiApiRouter.post("/predict-position/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], aiApiController.predictPosition);
aiApiRouter.post("/predict-physical/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], aiApiController.predictPhysical);
aiApiRouter.post("/analyze-prediction/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], aiApiController.analyzePrediction);
aiApiRouter.post("/team/analyze-prediction/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], aiApiController.analyzeTeamPrediction);
aiApiRouter.post("/full-recommendations-prediction/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], aiApiController.fullRecommendationsPrediction);
aiApiRouter.post("/team/predict-positions/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], aiApiController.predictTeamPositions);
aiApiRouter.post("/team/predict-physical/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], aiApiController.predictTeamPhysical);