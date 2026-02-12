import { Request, Response } from "express";
import { HttpStatus } from "../utilities/status.utility";
import { CoachTeamService } from "../services/implementation/coach-team.service";
import { ErrorHandler } from "../middlewares/error-handler.middleware";
import { AuthRequest } from "../interfaces";


export class CoachTeamController {
    private readonly coachTeamService: CoachTeamService;

    constructor() {
        this.coachTeamService = new CoachTeamService();
    }

    public findAll = async (req: Request, res: Response) => {
        try {
            const coachTeams = await this.coachTeamService.findAll();

            return res.status(HttpStatus.OK).json(coachTeams);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findAllIncludingInactive = async (req: Request, res: Response) => {
        try {
            const coachTeams = await this.coachTeamService.findAllIncludingInactive();

            return res.status(HttpStatus.OK).json(coachTeams);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
    
            const coachTeam = await this.coachTeamService.findById(+id);

            return res.status(HttpStatus.OK).json(coachTeam);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findByIdIncludingInactive = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
    
            const coachTeam = await this.coachTeamService.findByIdIncludingInactive(+id);

            return res.status(HttpStatus.OK).json(coachTeam);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findByCoachId = async (req: Request, res: Response) => {
        try {
            const { coachId } = req.params;
    
            const coachTeams = await this.coachTeamService.findByCoachId(+coachId);

            return res.status(HttpStatus.OK).json(coachTeams);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public save = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;
            const data = req.body;
            
            const coachTeam = await this.coachTeamService.save(+credentialId, data);

            return res.status(HttpStatus.CREATED).json(coachTeam);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            
            const coachTeam = await this.coachTeamService.update(data);

            return res.status(HttpStatus.OK).json(coachTeam);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            await this.coachTeamService.delete(+id);

            return res.status(HttpStatus.NO_CONTENT).json({ message: `La relación coach-team con ID: ${ id } fue eliminada correctamente` });
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public updateStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const coachTeam = await this.coachTeamService.updateStatus(+id, data);

            return res.status(HttpStatus.OK).json(coachTeam);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }
}