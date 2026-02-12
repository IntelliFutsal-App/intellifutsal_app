import type { CountByStatusResponse, DayOfWeekPointResponse, TeamMiniResponse, TimeSeriesPointResponse, WeekSeriesPointResponse } from ".";


export interface PlayerDashboardResponse {
    activeTeamsCount: number;
    pendingJoinRequestsCount: number;
    activeAssignmentsCount: number;
    completedAssignmentsCount: number;
    cancelledAssignmentsCount: number;
    progressTotalCount: number;
    coachVerifiedCount: number;
    coachVerificationRate: number;
    avgCompletionLast30Days: number;
    teams: TeamMiniResponse[];
    joinRequestsByStatus: CountByStatusResponse[];
    assignmentsByStatus: CountByStatusResponse[];
    progressLast30Days: TimeSeriesPointResponse[];
    completionByWeekLast8Weeks: WeekSeriesPointResponse[];
    progressHeatmapDow: DayOfWeekPointResponse[];
    streakDays: number;
}