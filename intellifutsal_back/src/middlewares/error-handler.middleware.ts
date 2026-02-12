import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../utilities/status.utility";
import { INTERNAL_SERVER_ERROR } from "../utilities/messages.utility";


export class ErrorHandler {
    static handleAnyError = (res: Response, error: Error | any): Response => {
        if (!error.message) return res.status(HttpStatus.BAD_REQUEST).json(error);
        if (error.name === "BadRequestException") return res.status(HttpStatus.BAD_REQUEST).json({ status: error.name, message: error.message, code: HttpStatus.BAD_REQUEST, details: ErrorHandler.formatErrorDetails(error) });
        if (error.name === "ConflictException") return res.status(HttpStatus.CONFLICT).json({ status: error.name, message: error.message, code: HttpStatus.CONFLICT, details: ErrorHandler.formatErrorDetails(error) });
        if (error.name === "NotFoundException") return res.status(HttpStatus.NOT_FOUND).json({ status: error.name, message: error.message, code: HttpStatus.NOT_FOUND, details: ErrorHandler.formatErrorDetails(error) });
        if (error.name === "UnauthorizedException") return res.status(HttpStatus.UNAUTHORIZED).json({ status: error.name, message: error.message, code: HttpStatus.UNAUTHORIZED, details: ErrorHandler.formatErrorDetails(error) });
        if (error.name === "ForbiddenException") return res.status(HttpStatus.FORBIDDEN).json({ status: error.name, message: error.message, code: HttpStatus.FORBIDDEN, details: ErrorHandler.formatErrorDetails(error) });
        if (error.name === "ValidationException") return res.status(HttpStatus.BAD_REQUEST).json({ status: error.name, message: error.message, code: HttpStatus.BAD_REQUEST, details: ErrorHandler.formatErrorDetails(error) });
        
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: error.name, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR, details: error.stack });
    }

    static handleAuthError = (error: Error, req: Request, res: Response, next: NextFunction): void => {
        if (error.name === "UnauthorizedException") {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: error.name,
                message: error.message,
                code: HttpStatus.UNAUTHORIZED,
                details: ErrorHandler.formatErrorDetails(error)
            });

            return;
        }
        
        if (error.name === "ForbiddenException") {
            res.status(HttpStatus.FORBIDDEN).json({
                status: error.name,
                message: error.message,
                code: HttpStatus.FORBIDDEN,
                details: ErrorHandler.formatErrorDetails(error)
            });

            return;
        }
        
        next(error);
    };

    static handleGlobalError = (error: Error, req: Request, res: Response, next: NextFunction): void => {
        console.error(`Error: ${ error.message }`);
        
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
            status: error.name,
            message: INTERNAL_SERVER_ERROR,
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            details: ErrorHandler.formatErrorDetails(error)
        });
    }

    private static formatErrorDetails = (error: Error | any): any => {
        if (!error.stack) return null;
        if (error.name === "ValidationException" && error.details) return error.details;

        try {
            const stackLines = error.stack.split("\n");
            const stackFrames = stackLines
                .slice(1) 
                .map((line: string) => {
                    line = line.trim();
                    
                    const matches = line.match(/at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/);
                    if (matches) {
                        return {
                            function: matches[1],
                            file: matches[2].split("\\").pop() || matches[2], 
                            line: parseInt(matches[3], 10),
                            column: parseInt(matches[4], 10)
                        };
                    }
                    
                    const simplifiedMatch = line.match(/at\s+(.*)/);
                    if (simplifiedMatch) {
                        return {
                            location: simplifiedMatch[1]
                        };
                    }
                    
                    return { raw: line };
                })
                .filter((frame: any) => frame !== null); 
            return {
                trace: stackFrames.slice(0, 5) 
            };
        } catch (e) {
            return {
                raw: error.stack.split("\n").slice(0, 3).join(" → ")
            };
        }
    }
}