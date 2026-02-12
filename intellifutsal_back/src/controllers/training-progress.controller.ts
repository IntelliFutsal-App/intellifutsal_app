import { Request, Response } from "express";
import { HttpStatus } from "../utilities/status.utility";
import { TrainingProgressService } from "../services/implementation/training-progress.service";
import { ErrorHandler } from "../middlewares/error-handler.middleware";
import { AuthRequest } from "../interfaces";


export class TrainingProgressController {
    private readonly trainingProgressService: TrainingProgressService;

    constructor() {
        this.trainingProgressService = new TrainingProgressService();
    }

    public findByAssignment = async (req: Request, res: Response) => {
        try {
            const { assignmentId } = req.params;

            const progress = await this.trainingProgressService.findByAssignment(+assignmentId);

            return res.status(HttpStatus.OK).json(progress);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public createByPlayer = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;
            const data = req.body;

            const progress = await this.trainingProgressService.createByPlayer(+credentialId, data);

            return res.status(HttpStatus.CREATED).json(progress);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public verifyByCoach = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;
            const { id } = req.params;
            const data = req.body;

            const progress = await this.trainingProgressService.verifyByCoach(+credentialId, +id, data);

            return res.status(HttpStatus.OK).json(progress);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };
}