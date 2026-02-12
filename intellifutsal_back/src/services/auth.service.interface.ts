import { AuthUserResponse, LoginUserRequest, LogoutUserRequest, RefreshTokenRequest, RegisterUserRequest } from "../interfaces";


export interface IAuthService {
    register(registerUserRequest: RegisterUserRequest): Promise<AuthUserResponse>;
    login(loginUserRequest: LoginUserRequest): Promise<AuthUserResponse>;
    validateToken(authHeader: string): Promise<any>;
    refreshToken(refreshTokenRequest: RefreshTokenRequest): Promise<AuthUserResponse>;
    logout(logoutUserRequest: LogoutUserRequest): Promise<void>;
}