import { UnauthorizedException } from "../../domain/exceptions";
import { ForbiddenException } from "../../domain/exceptions/forbidden.exception";
import { AuthRequest } from '../../domain/interfaces';
import { USER_NOT_AUTHENTICATED, USER_WITHOUT_PERMISSION } from '../../core/utilities/messages.utility';
import { NextFunction, Response } from "express";


export const roleMiddleware = (requiredRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) throw new UnauthorizedException(USER_NOT_AUTHENTICATED)
        
        const hasRole = requiredRoles.includes(req.user.role);
        if (!hasRole) throw new ForbiddenException(USER_WITHOUT_PERMISSION);
        
        next();
    };
};