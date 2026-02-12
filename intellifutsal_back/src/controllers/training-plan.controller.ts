import { Request, Response } from "express";
import { HttpStatus } from "../utilities/status.utility";
import { TrainingPlanService } from "../services/implementation/training-plan.service";
import { ErrorHandler } from "../middlewares/error-handler.middleware";
import { AuthRequest } from "../interfaces";


export class TrainingPlanController {
    private readonly trainingPlanService: TrainingPlanService;

    constructor() {
        this.trainingPlanService = new TrainingPlanService();
    }

    public findAll = async (req: Request, res: Response) => {
        try {
            const plans = await this.trainingPlanService.findAll();

            return res.status(HttpStatus.OK).json(plans);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public findById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const plan = await this.trainingPlanService.findById(+id);
            
            return res.status(HttpStatus.OK).json(plan);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public createManual = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;
            const data = req.body;

            const plan = await this.trainingPlanService.createManual(+credentialId, data);
            
            return res.status(HttpStatus.CREATED).json(plan);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public createFromAiForPlayer = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;
            const { playerId } = req.params;

            const plan = await this.trainingPlanService.createFromAiForPlayer(+playerId, +credentialId);
            
            return res.status(HttpStatus.CREATED).json(plan);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public createFromAiForTeam = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;
            const { teamId } = req.params;

            const plan = await this.trainingPlanService.createFromAiForTeam(+teamId, +credentialId);
            
            return res.status(HttpStatus.CREATED).json(plan);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public approve = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const plan = await this.trainingPlanService.approve(+id, data);
            
            return res.status(HttpStatus.OK).json(plan);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public reject = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const plan = await this.trainingPlanService.reject(+id, data);
            
            return res.status(HttpStatus.OK).json(plan);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public archive = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;

            const plan = await this.trainingPlanService.archive(+id);
            
            return res.status(HttpStatus.OK).json(plan);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };
}