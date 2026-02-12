import { RefreshToken } from "../models";

export class RefreshTokenMapper {
    static toEntity = (credentialId: number, token: string, expiresAt: Date): RefreshToken => {
        const refreshToken = new RefreshToken();

        refreshToken.credential = { id: credentialId } as any;
        refreshToken.token = token;
        refreshToken.expiresAt = expiresAt;
        refreshToken.revoked = false;
        
        return refreshToken;
    };
}