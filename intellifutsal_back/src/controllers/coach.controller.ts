import { Request, Response } from "express";
import { HttpStatus } from "../utilities/status.utility";
import { CoachService } from "../services/implementation/coach.service";
import { ErrorHandler } from "../middlewares/error-handler.middleware";
import { AuthRequest } from "../interfaces";


export class CoachController {
    private readonly coachService: CoachService;

    constructor() {
        this.coachService = new CoachService();
    }

    public findAll = async (req: Request, res: Response) => {
        try {
            const coaches = await this.coachService.findAll();

            return res.status(HttpStatus.OK).json(coaches);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findAllIncludingInactive = async (req: Request, res: Response) => {
        try {
            const coaches = await this.coachService.findAllIncludingInactive();

            return res.status(HttpStatus.OK).json(coaches);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            const coach = await this.coachService.findById(+id);

            return res.status(HttpStatus.OK).json(coach);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findByIdIncludingInactive = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            const coach = await this.coachService.findByIdIncludingInactive(+id);

            return res.status(HttpStatus.OK).json(coach);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public save = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;
            const data = req.body;
            
            const coach = await this.coachService.save(+credentialId, data);

            return res.status(HttpStatus.CREATED).json(coach);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            
            const coach = await this.coachService.update(data);

            return res.status(HttpStatus.OK).json(coach);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            await this.coachService.delete(+id);

            return res.status(HttpStatus.NO_CONTENT).json({ message: `El entrenador con ID: ${ id } fue eliminado correctamente` });
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public updateStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const coach = await this.coachService.updateStatus(+id, data);

            return res.status(HttpStatus.OK).json(coach);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }
}