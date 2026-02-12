import { AxiosService } from "@shared/lib";
import type { AuthResponse, Role, ValidateTokenResponse } from "../types";
import { TokenManager } from "./tokenManager";

class AuthService {
    private static instance: AuthService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/auth";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) AuthService.instance = new AuthService();

        return AuthService.instance;
    }

    async register(email: string, password: string, role: Role): Promise<AuthResponse> {
        const response = await this.axios.post<AuthResponse>(`${this.BASE_PATH}/register`, {
            email,
            password,
            role,
        });

        return response.data;
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await this.axios.post<AuthResponse>(`${this.BASE_PATH}/login`, {
            email,
            password,
        });

        return response.data;
    }

    async validateToken(): Promise<ValidateTokenResponse> {
        const response = await this.axios.get<ValidateTokenResponse>(`${this.BASE_PATH}/validate-token`);

        return response.data;
    }

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const response = await this.axios.post<AuthResponse>(`${this.BASE_PATH}/refresh-token`, { refreshToken });
        
        return response.data;
    }

    async logout(): Promise<void> {
        const refreshToken = TokenManager.getRefreshToken();

        if (refreshToken) await this.axios.post(`${this.BASE_PATH}/logout`, { refreshToken });
    }
}

export const authService = AuthService.getInstance();