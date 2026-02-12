import { CoachDashboardResponse, PlayerDashboardResponse } from "../interfaces/dashboard";

export interface IDashboardService {
    getCoachDashboard(credentialId: number): Promise<CoachDashboardResponse>;
    getPlayerDashboard(credentialId: number): Promise<PlayerDashboardResponse>;
}