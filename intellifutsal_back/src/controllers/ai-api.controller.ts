import { Request, Response } from "express";
import { AiApiService } from "../services/implementation/ai-api.service";
import { ErrorHandler } from "../middlewares";
import { HttpStatus } from "../utilities/status.utility";


export class AiApiController {
    private readonly aiApiService: AiApiService;

    constructor() {
        this.aiApiService = new AiApiService();
    }

    public predictPosition = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
        
            const response = await this.aiApiService.predictPosition(+id);

            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public predictPhysical = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
        
            const response = await this.aiApiService.predictPhysical(+id);

            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public analyzePrediction = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
        
            const response = await this.aiApiService.analyzePrediction(+id);

            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public analyzeTeamPrediction = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
        
            const response = await this.aiApiService.analyzeTeamPrediction(+id);

            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public fullRecommendationsPrediction = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
        
            const response = await this.aiApiService.fullRecommendationsPrediction(+id);

            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public predictTeamPositions = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
        
            const response = await this.aiApiService.predictTeamPositions(+id);

            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public predictTeamPhysical = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
        
            const response = await this.aiApiService.predictTeamPhysical(+id);

            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }
}