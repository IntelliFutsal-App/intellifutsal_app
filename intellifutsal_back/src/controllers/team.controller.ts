import { Request, Response } from "express";
import { HttpStatus } from "../utilities/status.utility";
import { TeamService } from "../services/implementation/team.service";
import { ErrorHandler } from "../middlewares/error-handler.middleware";
import { AuthRequest } from "../interfaces";


export class TeamController {
    private readonly teamService: TeamService;

    constructor() {
        this.teamService = new TeamService();
    }

    public findAll = async (req: Request, res: Response) => {
        try {
            const teams = await this.teamService.findAll();

            return res.status(HttpStatus.OK).json(teams);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findAllIncludingInactive = async (req: Request, res: Response) => {
        try {
            const teams = await this.teamService.findAllIncludingInactive();

            return res.status(HttpStatus.OK).json(teams);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const team = await this.teamService.findById(+id);

            return res.status(HttpStatus.OK).json(team);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findByIdIncludingInactive = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const team = await this.teamService.findByIdIncludingInactive(+id);

            return res.status(HttpStatus.OK).json(team);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findMyTeams = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;

            const teams = await this.teamService.findMyTeams(+credentialId);

            return res.status(HttpStatus.OK).json(teams);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public save = async (req: Request, res: Response) => {
        try {
            const data = req.body;

            const team = await this.teamService.save(data);

            return res.status(HttpStatus.CREATED).json(team);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const data = req.body;

            const team = await this.teamService.update(data);

            return res.status(HttpStatus.OK).json(team);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            await this.teamService.delete(+id);

            return res.status(HttpStatus.NO_CONTENT).json({ message: `El equipo con ID: ${ id } fue eliminado correctamente` });
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public updateStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const team = await this.teamService.updateStatus(+id, data);

            return res.status(HttpStatus.OK).json(team);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }
}