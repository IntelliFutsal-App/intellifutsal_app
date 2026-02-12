import { Request, Response } from "express";
import { HttpStatus } from "../utilities/status.utility";
import { PlayerClusterService } from "../services/implementation/player-cluster.service";
import { ErrorHandler } from "../middlewares/error-handler.middleware";


export class PlayerClusterController {
    private readonly playerClusterService: PlayerClusterService;

    constructor() {
        this.playerClusterService = new PlayerClusterService();
    }

    public findAll = async (req: Request, res: Response) => {
        try {
            const playerClusters = await this.playerClusterService.findAll();

            return res.status(HttpStatus.OK).json(playerClusters);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            const playerCluster = await this.playerClusterService.findById(+id);

            return res.status(HttpStatus.OK).json(playerCluster);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public save = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            
            const playerCluster = await this.playerClusterService.save(data);

            return res.status(HttpStatus.CREATED).json(playerCluster);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            
            const playerCluster = await this.playerClusterService.update(data);

            return res.status(HttpStatus.OK).json(playerCluster);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            await this.playerClusterService.delete(+id);

            return res.status(HttpStatus.NO_CONTENT).json({ message: `La relación player-cluster con ID: ${ id } fue eliminada correctamente` });
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }
}