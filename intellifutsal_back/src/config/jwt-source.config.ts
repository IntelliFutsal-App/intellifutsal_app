import * as dotenv from 'dotenv';


dotenv.config();

export const JwtDataSource = {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessTokenExpiration: process.env.JWT_ACCESS_EXPIRATION || "30m",
    refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION || "7d",
    tokenType: "Bearer",
};