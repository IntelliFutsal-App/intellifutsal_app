import { Request, Response } from "express";
import { HttpStatus } from "../utilities/status.utility";
import { JoinRequestService } from "../services/implementation/join-request.service";
import { ErrorHandler } from "../middlewares/error-handler.middleware";
import { AuthRequest } from "../interfaces";


export class JoinRequestController {
    private readonly joinRequestService: JoinRequestService;

    constructor() {
        this.joinRequestService = new JoinRequestService();
    }

    public findAll = async (req: Request, res: Response) => {
        try {
            const requests = await this.joinRequestService.findAll();

            return res.status(HttpStatus.OK).json(requests);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public findById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const request = await this.joinRequestService.findById(+id);

            return res.status(HttpStatus.OK).json(request);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public findMyRequests = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;

            const requests = await this.joinRequestService.findByPlayer(+credentialId);

            return res.status(HttpStatus.OK).json(requests);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public findPendingByTeam = async (req: Request, res: Response) => {
        try {
            const { teamId } = req.params;

            const requests = await this.joinRequestService.findPendingByTeam(+teamId);

            return res.status(HttpStatus.OK).json(requests);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public create = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;
            const data = req.body;

            const request = await this.joinRequestService.create(+credentialId, data);

            return res.status(HttpStatus.CREATED).json(request);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public approve = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const credentialId = req.user!.id;

            const request = await this.joinRequestService.approve(+id, +credentialId);

            return res.status(HttpStatus.OK).json(request);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public reject = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const credentialId = req.user!.id;
            const data = req.body;

            const request = await this.joinRequestService.reject(+id, +credentialId, data);

            return res.status(HttpStatus.OK).json(request);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public cancel = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const credentialId = req.user!.id;

            const request = await this.joinRequestService.cancel(+id, +credentialId);

            return res.status(HttpStatus.OK).json(request);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            await this.joinRequestService.delete(+id);

            return res.status(HttpStatus.NO_CONTENT).json({ message: `La solicitud con ID: ${ id } fue eliminada correctamente` });
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };
}