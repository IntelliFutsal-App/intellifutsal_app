import { Request, Response } from "express";
import { HttpStatus } from "../utilities/status.utility";
import { ClusterService } from "../services/implementation/cluster.service";
import { ErrorHandler } from "../middlewares/error-handler.middleware";


export class ClusterController {
    private readonly clusterService: ClusterService;

    constructor() {
        this.clusterService = new ClusterService();
    }

    public findAll = async (req: Request, res: Response) => {
        try {
            const clusters = await this.clusterService.findAll();

            return res.status(HttpStatus.OK).json(clusters);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const cluster = await this.clusterService.findById(+id);

            return res.status(HttpStatus.OK).json(cluster);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public save = async (req: Request, res: Response) => {
        try {
            const data = req.body;
        
            const cluster = await this.clusterService.save(data);

            return res.status(HttpStatus.CREATED).json(cluster);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const data = req.body;
        
            const cluster = await this.clusterService.update(data);

            return res.status(HttpStatus.OK).json(cluster);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
        
            await this.clusterService.delete(+id);

            return res.status(HttpStatus.NO_CONTENT).json({ message: `El cluster con ID: ${ id } fue eliminado correctamente` });
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }
}