import { Response } from "express";
import { DashboardService } from "../services/implementation/dashboard.service";
import { ErrorHandler } from "../middlewares/error-handler.middleware";
import { HttpStatus } from "../utilities/status.utility";
import { AuthRequest } from "../interfaces";


export class DashboardController {
    private readonly dashboardService: DashboardService;

    constructor() {
        this.dashboardService = new DashboardService();
    }

    public getCoachDashboard = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;

            const response = await this.dashboardService.getCoachDashboard(+credentialId);
            
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };

    public getPlayerDashboard = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;

            const response = await this.dashboardService.getPlayerDashboard(+credentialId);
            
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    };
}