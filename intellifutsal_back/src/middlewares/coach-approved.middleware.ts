import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces";
import { ForbiddenException, UnauthorizedException } from "../exceptions";
import { OnboardingStatus, Role } from "../interfaces";
import { COACH_PENDING_APPROVAL, UNAUTHORIZED_RESOURCE_ACCESS } from "../utilities/messages.utility";


export const coachApprovedMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) throw new UnauthorizedException(UNAUTHORIZED_RESOURCE_ACCESS);

    if (user.role !== Role.COACH) return next();
    if (user.onboardingStatus !== OnboardingStatus.ACTIVE) {
        throw new ForbiddenException(COACH_PENDING_APPROVAL);
    }

    next();
};