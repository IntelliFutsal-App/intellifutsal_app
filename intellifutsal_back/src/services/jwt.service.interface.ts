import { UserResponse } from "../interfaces";


export interface IJwtService {
    generateAccessToken(user: UserResponse): string;
    generateRefreshToken(user: UserResponse): string;
    verifyAccessToken(token: string): UserResponse;
    verifyRefreshToken(token: string): UserResponse;
    getType(): string;
    getAccessExpirationInSeconds(): number;
}