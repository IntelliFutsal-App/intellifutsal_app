import { ErrorHandler } from "../middlewares/error-handler.middleware";
import { AuthService } from "../services/implementation/auth.service";
import { HttpStatus } from "../utilities/status.utility";
import { Request, Response } from "express";


export class AuthController {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public register = async (req: Request, res: Response) => {
        try {
            const data = req.body;
        
            const user = await this.authService.register(data);

            return res.status(HttpStatus.CREATED).json(user);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const data = req.body;
        
            const user = await this.authService.login(data);

            return res.status(HttpStatus.OK).json(user);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public validateToken = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;

            const validationResult = await this.authService.validateToken(authHeader!);
            
            return res.status(HttpStatus.OK).json(validationResult);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public refreshToken = async (req: Request, res: Response) => {
        try {
            const data = req.body;

            const user = await this.authService.refreshToken(data);

            return res.status(HttpStatus.OK).json(user);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }

    public logout = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            
            await this.authService.logout(data);
            
            return res.status(HttpStatus.NO_CONTENT).send();
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }
}