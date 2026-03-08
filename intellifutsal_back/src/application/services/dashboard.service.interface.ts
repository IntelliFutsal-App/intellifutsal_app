import { CoachDashboardResponse, PlayerDashboardResponse } from '../../domain/interfaces/dashboard';

export interface IDashboardService {
    getCoachDashboard(credentialId: number): Promise<CoachDashboardResponse>;
    getPlayerDashboard(credentialId: number): Promise<PlayerDashboardResponse>;
}