import { AuthRequest } from "../interfaces";
import { ErrorHandler } from "../middlewares";
import { ProfileService } from "../services/implementation/profile.service";
import { HttpStatus } from "../utilities/status.utility";
import { Response } from "express";


export class ProfileController {
    private readonly profileService: ProfileService;

    constructor() {
        this.profileService = new ProfileService();
    }

    public getMyState = async (req: AuthRequest, res: Response) => {
        try {
            const credentialId = req.user!.id;

            const state = await this.profileService.getMyState(+credentialId);

            return res.status(HttpStatus.OK).json(state);
        } catch (error) {
            return ErrorHandler.handleAnyError(res, error);
        }
    }
}