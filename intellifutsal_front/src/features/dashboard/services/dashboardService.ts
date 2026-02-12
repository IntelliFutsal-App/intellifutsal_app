import { AxiosService } from "@shared/lib";
import type { CoachDashboardResponse, PlayerDashboardResponse } from "../types";
import { normalizeCoachDashboard, normalizePlayerDashboard } from "@shared/utils/dashboardUtils";

class DashboardService {
    private static instance: DashboardService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/dashboard";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): DashboardService {
        if (!DashboardService.instance) DashboardService.instance = new DashboardService();

        return DashboardService.instance;
    }

    async getCoachDashboard(): Promise<CoachDashboardResponse> {
        const response = await this.axios.get<CoachDashboardResponse>(
            `${this.BASE_PATH}/coach`,
        );

        return normalizeCoachDashboard(response.data);
    }

    async getPlayerDashboard(): Promise<PlayerDashboardResponse> {
        const response = await this.axios.get<PlayerDashboardResponse>(
            `${this.BASE_PATH}/player`,
        );

        return normalizePlayerDashboard(response.data);
    }
}

export const dashboardService = DashboardService.getInstance();