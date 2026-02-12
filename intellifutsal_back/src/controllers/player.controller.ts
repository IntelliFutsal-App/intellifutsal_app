import { Request, Response } from "express";
import { HttpStatus } from "../utilities/status.utility";
import { PlayerService } from "../services/implementation/player.service";
import { ErrorHandler } from "../middlewares/error-handler.middleware";
import { AuthRequest } from "../interfaces";


export class PlayerController {
    private readonly playerService: PlayerService;

    constructor() {
        this.playerService = new PlayerService();
    }

    public findAll = async (req: Request, res: Response) => {
        try {
            const players = await this.playerService.findAll();

            return res.status(HttpStatus.OK).json(players);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findAllIncludingInactive = async (req: Request, res: Response) => {
        try {
            const players = await this.playerService.findAllIncludingInactive();

            return res.status(HttpStatus.OK).json(players);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            const player = await this.playerService.findById(+id);

            return res.status(HttpStatus.OK).json(player);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findByIdIncludingInactive = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            const player = await this.playerService.findByIdIncludingInactive(+id);

            return res.status(HttpStatus.OK).json(player);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findByTeamId = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            const players = await this.playerService.findByTeamId(+id);

            return res.status(HttpStatus.OK).json(players);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public save = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;
            const data = req.body;
            
            const player = await this.playerService.save(+credentialId, data);

            return res.status(HttpStatus.CREATED).json(player);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            
            const player = await this.playerService.update(data);

            return res.status(HttpStatus.OK).json(player);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            await this.playerService.delete(+id);

            return res.status(HttpStatus.NO_CONTENT).json({ message: `El jugador con ID: ${ id } fue eliminado correctamente` });
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public updateStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const player = await this.playerService.updateStatus(+id, data);

            return res.status(HttpStatus.OK).json(player);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }
}