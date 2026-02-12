import { JwtDataSource } from "../../config/jwt-source.config";
import { ForbiddenException, UnauthorizedException } from "../../exceptions";
import { UserResponse } from "../../interfaces";
import { INVALID_TOKEN_EXPIRATION_TIME, JWT_INVALID_OR_EXPIRED, TIME_UNIT_NOT_RECOGNIZED } from "../../utilities/messages.utility";
import { IJwtService } from "../jwt.service.interface";
import jwt, { SignOptions } from "jsonwebtoken";


export class JwtService implements IJwtService {
    public generateAccessToken = (user: UserResponse): string => {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
            onboardingStatus: user.onboardingStatus,
        };

        const signOptions: SignOptions = {
            expiresIn: this.parseExpiration(JwtDataSource.accessTokenExpiration),
        };

        return jwt.sign(payload, JwtDataSource.jwtAccessSecret, signOptions);
    };

    public generateRefreshToken = (user: UserResponse): string => {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const signOptions: SignOptions = {
            expiresIn: this.parseExpiration(JwtDataSource.refreshTokenExpiration),
        };

        return jwt.sign(payload, JwtDataSource.jwtRefreshSecret, signOptions);
    };

    public verifyAccessToken = (token: string): UserResponse => {
        try {
            const decoded = jwt.verify(
                token,
                JwtDataSource.jwtAccessSecret,
            ) as UserResponse;

            return decoded;
        } catch {
            throw new UnauthorizedException(JWT_INVALID_OR_EXPIRED);
        }
    };

    public verifyRefreshToken = (token: string): UserResponse => {
        try {
            const decoded = jwt.verify(
                token,
                JwtDataSource.jwtRefreshSecret,
            ) as UserResponse;

            return decoded;
        } catch {
            throw new ForbiddenException(JWT_INVALID_OR_EXPIRED);
        }
    };

    public getType = (): string => JwtDataSource.tokenType;

    public getAccessExpirationInSeconds = (): number => {
        return this.parseExpiration(JwtDataSource.accessTokenExpiration);
    };

    private parseExpiration = (timeString: string): number => {
        const match = timeString.match(/^(\d+)([smhdwy])$/i);

        if (!match) throw new Error(INVALID_TOKEN_EXPIRATION_TIME);

        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();

        switch (unit) {
            case "s":
                return value;
            case "m":
                return value * 60;
            case "h":
                return value * 3600;
            case "d":
                return value * 86400;
            case "w":
                return value * 604800;
            case "y":
                return value * 31536000;
            default:
                throw new Error(TIME_UNIT_NOT_RECOGNIZED);
        }
    };
}