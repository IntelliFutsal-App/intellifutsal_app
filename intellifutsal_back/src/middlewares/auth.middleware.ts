import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../interfaces";
import { UnauthorizedException } from "../exceptions";
import { JWT_INVALID_OR_EXPIRED, JWT_NOT_PROVIDED } from "../utilities/messages.utility";
import { JwtDataSource } from "../config/jwt-source.config";


export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new UnauthorizedException(JWT_NOT_PROVIDED);
    
    try {
        const jwtPayload = jwt.verify(token, JwtDataSource.jwtAccessSecret) as JwtPayload;

        req.user = jwtPayload as JwtPayload;
        
        next();
    } catch (error) {
        throw new UnauthorizedException(JWT_INVALID_OR_EXPIRED);
    }
};