import { AuthUserResponse, UserResponse } from "../interfaces";


export class AuthMapper {
    static toResponse = (user: UserResponse, accessToken: string, refreshToken: string, tokenType: string, expiresIn: number): AuthUserResponse => {
        const authUserResponse = new AuthUserResponse();

        authUserResponse.user = user;
        authUserResponse.accessToken = accessToken;
        authUserResponse.refreshToken = refreshToken;
        authUserResponse.tokenType = tokenType;
        authUserResponse.expiresIn = expiresIn;

        return authUserResponse;
    }

    static toValidateTokenResponse = (valid: boolean, user: UserResponse | null) => {
        return {
            valid,
            user
        };
    }
}