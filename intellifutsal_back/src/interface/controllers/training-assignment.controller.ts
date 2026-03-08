import { Request, Response } from "express";
import { HttpStatus } from '../../core/utilities/status.utility';
import { TrainingAssignmentService } from '../../application/services/implementation/training-assignment.service';
import { ErrorHandler } from '../middlewares/error-handler.middleware';
import { AuthRequest } from '../../domain/interfaces';


export class TrainingAssignmentController {
    private readonly trainingAssignmentService: TrainingAssignmentService;

    constructor() {
        this.trainingAssignmentService = new TrainingAssignmentService();
    }

    public findAll = async (req: Request, res: Response) => {
        try {
            const assignments = await this.trainingAssignmentService.findAll();

            return res.status(HttpStatus.OK).json(assignments);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public findMyAssignments = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;

            const assignments = await this.trainingAssignmentService.findByPlayer(+credentialId);

            return res.status(HttpStatus.OK).json(assignments);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public findByTeam = async (req: Request, res: Response) => {
        try {
            const { teamId } = req.params;

            const assignments = await this.trainingAssignmentService.findByTeam(+teamId);

            return res.status(HttpStatus.OK).json(assignments);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public findById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const assignment = await this.trainingAssignmentService.findById(+id);

            return res.status(HttpStatus.OK).json(assignment);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public create = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;
            const data = req.body;

            const assignment = await this.trainingAssignmentService.create(+credentialId, data);

            return res.status(HttpStatus.CREATED).json(assignment);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public activate = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const assignment = await this.trainingAssignmentService.activate(+id);

            return res.status(HttpStatus.OK).json(assignment);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public cancel = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const assignment = await this.trainingAssignmentService.cancel(+id);

            return res.status(HttpStatus.OK).json(assignment);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };
}