/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AuthResponse } from "@features/auth";
import { TokenManager } from "@features/auth/services/tokenManager";
import type { ErrorResponse } from "../types";
import type { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { toast } from "react-toastify";

export class AxiosService {
    private static instance: AxiosService;
    private axiosInstance: AxiosInstance;
    private isRefreshing = false;

    private failedQueue: Array<{
        resolve: (token: string) => void;
        reject: (reason?: any) => void;
    }> = [];

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_API_URL!,
            timeout: 15000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.setupInterceptors();
    }

    public static getInstance(): AxiosService {
        if (!AxiosService.instance) AxiosService.instance = new AxiosService();

        return AxiosService.instance;
    }

    private setupInterceptors(): void {
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = TokenManager.getAccessToken();

                const publicRoutes = ["/auth/login", "/auth/register", "/auth/refresh-token"];
                const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));

                if (token && !isPublicRoute) config.headers.Authorization = `Bearer ${token}`;

                return config;
            },
            (error) => Promise.reject(error),
        );

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ErrorResponse>) => this.handleResponseError(error),
        );
    }

    private async handleResponseError(error: AxiosError<ErrorResponse>): Promise<any> {
        const originalRequest = error.config as (InternalAxiosRequestConfig & {
            _retry?: boolean;
        });

        if (error.response) {
            const { status, data } = error.response;
            const errorMessage = data?.message || "Ha ocurrido un error inesperado.";

            const isRefreshEndpoint = originalRequest.url?.includes("/auth/refresh-token") ?? false;
            if (status === 401 && !isRefreshEndpoint) return this.handleUnauthorizedError(error, originalRequest);

            this.showHttpErrorToast(status, errorMessage, isRefreshEndpoint);
        } else if (error.request) {
            toast.error("Error de red. Por favor, compruebe su conexión.");
        } else {
            toast.error("Ocurrió un error inesperado.");
        }

        return Promise.reject(error);
    }

    private async handleUnauthorizedError(error: AxiosError<ErrorResponse>, originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }): Promise<any> {
        const hasRefreshToken = !!TokenManager.getRefreshToken();

        if (!hasRefreshToken) {
            TokenManager.clearTokens();
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            TokenManager.clearTokens();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (this.isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
            }).then((token) => {
                this.setAuthorizationHeader(originalRequest, token);
                return this.axiosInstance(originalRequest);
            });
        }

        this.isRefreshing = true;

        try {
            const newToken = await this.refreshAccessToken();
            this.processQueue(null, newToken);
            this.setAuthorizationHeader(originalRequest, newToken);
            return this.axiosInstance(originalRequest);
        } catch (refreshError) {
            this.processQueue(refreshError);
            TokenManager.clearTokens();
            toast.error("La sesión ha expirado. Por favor, inicie sesión de nuevo.");
            return Promise.reject(refreshError);
        } finally {
            this.isRefreshing = false;
        }
    }

    private showHttpErrorToast(status: number, errorMessage: string, isRefreshEndpoint: boolean): void {
        switch (status) {
            case 403:
                toast.error("Acceso denegado. Permisos insuficientes.");
                break;
            case 404:
                toast.error("Recurso no encontrado.");
                break;
            case 409:
                toast.warning(errorMessage);
                break;
            default:
                if (status >= 500) toast.error("Error del servidor. Por favor, inténtelo de nuevo más tarde.");
                else if (!isRefreshEndpoint) toast.error(errorMessage);
        }
    }

    private setAuthorizationHeader(config: InternalAxiosRequestConfig, token: string): void {
        config.headers = config.headers || {};

        const headers = config.headers as any;

        if (typeof headers.set === "function") headers.set("Authorization", `Bearer ${token}`);
        else headers.Authorization = `Bearer ${token}`;
    }

    private async refreshAccessToken(): Promise<string> {
        const refreshToken = TokenManager.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        try {
            const response = await this.axiosInstance.post<AuthResponse>(
                "/auth/refresh-token",
                { refreshToken },
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data;
            TokenManager.setTokens(accessToken, newRefreshToken);

            return accessToken;
        } catch (error) {
            TokenManager.clearTokens();
            throw error;
        }
    }

    private processQueue(error: any, token?: string): void {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) reject(error);
            else resolve(token!);
        });
        this.failedQueue = [];
    }

    public getAxios(): AxiosInstance {
        return this.axiosInstance;
    }

    public async get<T>(url: string, config: AxiosRequestConfig = {}) {
        return this.axiosInstance.get<T>(url, config);
    }

    public async post<T>(url: string, data?: any, config: AxiosRequestConfig = {}) {
        return this.axiosInstance.post<T>(url, data, config);
    }

    public async put<T>(url: string, data?: any, config: AxiosRequestConfig = {}) {
        return this.axiosInstance.put<T>(url, data, config);
    }

    public async patch<T>(url: string, data?: any, config: AxiosRequestConfig = {}) {
        return this.axiosInstance.patch<T>(url, data, config);
    }

    public async delete<T>(url: string, config: AxiosRequestConfig = {}) {
        return this.axiosInstance.delete<T>(url, config);
    }
}

export const axiosService = AxiosService.getInstance();