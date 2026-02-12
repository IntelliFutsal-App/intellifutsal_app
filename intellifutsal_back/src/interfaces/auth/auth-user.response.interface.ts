import { UserResponse } from "../user";


export class AuthUserResponse {
    accessToken!: string;
    refreshToken!: string;
    tokenType!: string;
    expiresIn!: number;
    user!: UserResponse;
}