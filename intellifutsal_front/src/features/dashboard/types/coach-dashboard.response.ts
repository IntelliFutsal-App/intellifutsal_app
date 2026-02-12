import type { CountByKeyResponse, CountByStatusResponse, DayOfWeekPointResponse, JoinRequestReviewTimeResponse, PositionDistributionResponse, TeamActivityResponse, TeamMiniResponse, TimeSeriesPointResponse } from ".";

export interface CoachDashboardResponse {
    activeTeamsCount: number;
    activePlayersCount: number;
    pendingJoinRequestsCount: number;
    activeAssignmentsCount: number;
    completedAssignmentsCount: number;
    cancelledAssignmentsCount: number;
    progressTotalCount: number;
    coachVerifiedCount: number;
    coachVerificationRate: number;
    teams: TeamMiniResponse[];
    joinRequestsByStatus: CountByStatusResponse[];
    trainingPlansByStatus: CountByStatusResponse[];
    trainingPlansByOrigin: CountByStatusResponse[];
    assignmentsByStatus: CountByStatusResponse[];
    progressLast14Days: TimeSeriesPointResponse[];
    assignmentsLast14Days: TimeSeriesPointResponse[];
    positionsDistribution: PositionDistributionResponse[];
    joinRequestsFunnel: CountByKeyResponse[];
    joinRequestConversionRate: number;
    progressHeatmapDow: DayOfWeekPointResponse[];
    trainingPlansByFocusArea: CountByKeyResponse[];
    trainingPlansByDifficulty: CountByKeyResponse[];
    teamActivity: TeamActivityResponse[];
    joinRequestAvgReviewTime: JoinRequestReviewTimeResponse[];
    progressLast30Days: TimeSeriesPointResponse[];
    assignmentsLast30Days: TimeSeriesPointResponse[];
}