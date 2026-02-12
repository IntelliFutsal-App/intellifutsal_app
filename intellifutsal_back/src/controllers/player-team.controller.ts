import { Request, Response } from "express";
import { HttpStatus } from "../utilities/status.utility";
import { PlayerTeamService } from "../services/implementation/player-team.service";
import { ErrorHandler } from "../middlewares/error-handler.middleware";


export class PlayerTeamController {
    private readonly playerTeamService: PlayerTeamService;

    constructor() {
        this.playerTeamService = new PlayerTeamService();
    }

    public findAll = async (req: Request, res: Response) => {
        try {
            const playerTeams = await this.playerTeamService.findAll();

            return res.status(HttpStatus.OK).json(playerTeams);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findAllIncludingInactive = async (req: Request, res: Response) => {
        try {
            const playerTeams = await this.playerTeamService.findAllIncludingInactive();

            return res.status(HttpStatus.OK).json(playerTeams);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            const playerTeam = await this.playerTeamService.findById(+id);

            return res.status(HttpStatus.OK).json(playerTeam);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findByIdIncludingInactive = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            const playerTeam = await this.playerTeamService.findByIdIncludingInactive(+id);

            return res.status(HttpStatus.OK).json(playerTeam);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findByPlayerId = async (req: Request, res: Response) => {
        try {
            const { playerId } = req.params;
            
            const playerTeams = await this.playerTeamService.findByPlayerId(+playerId);

            return res.status(HttpStatus.OK).json(playerTeams);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public save = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            
            const playerTeam = await this.playerTeamService.save(data);

            return res.status(HttpStatus.CREATED).json(playerTeam);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            
            const playerTeam = await this.playerTeamService.update(data);

            return res.status(HttpStatus.OK).json(playerTeam);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            await this.playerTeamService.delete(+id);

            return res.status(HttpStatus.NO_CONTENT).json({ message: `La relación player-team con ID: ${ id } fue eliminada correctamente` });
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public updateStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const playerTeam = await this.playerTeamService.updateStatus(+id, data);

            return res.status(HttpStatus.OK).json(playerTeam);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }
}