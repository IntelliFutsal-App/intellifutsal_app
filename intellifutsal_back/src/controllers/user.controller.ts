import { Request, Response } from "express";
import { HttpStatus } from "../utilities/status.utility";
import { UserService } from "../services/implementation/user.service";
import { ErrorHandler } from "../middlewares/error-handler.middleware";


export class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public findAll = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.findAll();

            return res.status(HttpStatus.OK).json(users);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findAllIncludingInactive = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.findAllIncludingInactive();

            return res.status(HttpStatus.OK).json(users);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            const user = await this.userService.findById(+id);

            return res.status(HttpStatus.OK).json(user);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findByIdIncludingInactive = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            const user = await this.userService.findByIdIncludingInactive(+id);

            return res.status(HttpStatus.OK).json(user);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findByEmail = async (req: Request, res: Response) => {
        try {
            const { email } = req.params;
            
            const user = await this.userService.findByEmail(email);

            return res.status(HttpStatus.OK).json(user);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public findRoleEntityById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            const roleEntity = await this.userService.findRoleEntityById(+id);

            return res.status(HttpStatus.OK).json(roleEntity);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public save = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            
            const user = await this.userService.save(data);

            return res.status(HttpStatus.CREATED).json(user);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            
            const user = await this.userService.update(data);

            return res.status(HttpStatus.OK).json(user);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            await this.userService.delete(+id);

            return res.status(HttpStatus.NO_CONTENT).json({ message: `El usuario con ID: ${ id } fue eliminado correctamente` });
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public updateStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const user = await this.userService.updateStatus(+id, data);

            return res.status(HttpStatus.OK).json(user);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }
}