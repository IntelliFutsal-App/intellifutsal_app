import { AxiosService } from "@shared/lib";
import type { AiApiAnalyzeResponse, AiApiFullRecommendationsResponse, AiApiPhysicalResponse, AiApiPositionResponse, AiApiTeamAnalyzeResponse, AiApiTeamPhysicalResponse, AiApiTeamPositionsResponse } from "../types";

class AiApiService {
    private static instance: AiApiService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/ai-api";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): AiApiService {
        if (!AiApiService.instance) AiApiService.instance = new AiApiService();

        return AiApiService.instance;
    }

    async predictPosition(playerId: number): Promise<AiApiPositionResponse> {
        const response = await this.axios.post<AiApiPositionResponse>(
            `${this.BASE_PATH}/predict-position/${playerId}`,
        );

        return response.data;
    }

    async predictPhysical(playerId: number): Promise<AiApiPhysicalResponse> {
        const response = await this.axios.post<AiApiPhysicalResponse>(
            `${this.BASE_PATH}/predict-physical/${playerId}`,
        );

        return response.data;
    }

    async analyze(playerId: number): Promise<AiApiAnalyzeResponse> {
        const response = await this.axios.post<AiApiAnalyzeResponse>(
            `${this.BASE_PATH}/analyze-prediction/${playerId}`,
            undefined,
            { timeout: 60000 },
        );

        return response.data;
    }

    async fullRecommendations(playerId: number): Promise<AiApiFullRecommendationsResponse> {
        const response = await this.axios.post<AiApiFullRecommendationsResponse>(
            `${this.BASE_PATH}/full-recommendations-prediction/${playerId}`,
            undefined,
            { timeout: 60000 },
        );

        return response.data;
    }

    async analyzeTeam(teamId: number): Promise<AiApiTeamAnalyzeResponse> {
        const response = await this.axios.post<AiApiTeamAnalyzeResponse>(
            `${this.BASE_PATH}/team/analyze-prediction/${teamId}`,
            undefined,
            { timeout: 60000 },
        );

        return response.data;
    }

    async predictTeamPositions(teamId: number): Promise<AiApiTeamPositionsResponse> {
        const response = await this.axios.post<AiApiTeamPositionsResponse>(
            `${this.BASE_PATH}/team/predict-positions/${teamId}`,
        );

        return response.data;
    }

    async predictTeamPhysical(teamId: number): Promise<AiApiTeamPhysicalResponse> {
        const response = await this.axios.post<AiApiTeamPhysicalResponse>(
            `${this.BASE_PATH}/team/predict-physical/${teamId}`,
        );

        return response.data;
    }
}

export const aiApiService = AiApiService.getInstance();