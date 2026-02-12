import type { CoachDashboardResponse, PlayerDashboardResponse } from "@features/dashboard/types";

export const normalizeCoachDashboard = (d: CoachDashboardResponse): CoachDashboardResponse => ({
    ...d,
    teams: d.teams ?? [],
    joinRequestsByStatus: d.joinRequestsByStatus ?? [],
    trainingPlansByStatus: d.trainingPlansByStatus ?? [],
    trainingPlansByOrigin: d.trainingPlansByOrigin ?? [],
    assignmentsByStatus: d.assignmentsByStatus ?? [],
    progressLast14Days: d.progressLast14Days ?? [],
    assignmentsLast14Days: d.assignmentsLast14Days ?? [],
    positionsDistribution: d.positionsDistribution ?? [],
    joinRequestsFunnel: d.joinRequestsFunnel ?? [],
    progressHeatmapDow: d.progressHeatmapDow ?? [],
    trainingPlansByFocusArea: d.trainingPlansByFocusArea ?? [],
    trainingPlansByDifficulty: d.trainingPlansByDifficulty ?? [],
    teamActivity: d.teamActivity ?? [],
    joinRequestAvgReviewTime: d.joinRequestAvgReviewTime ?? [],
    progressLast30Days: d.progressLast30Days ?? [],
    assignmentsLast30Days: d.assignmentsLast30Days ?? [],
});

export const normalizePlayerDashboard = (d: PlayerDashboardResponse): PlayerDashboardResponse => ({
    ...d,
    teams: d.teams ?? [],
    joinRequestsByStatus: d.joinRequestsByStatus ?? [],
    assignmentsByStatus: d.assignmentsByStatus ?? [],
    progressLast30Days: d.progressLast30Days ?? [],
    completionByWeekLast8Weeks: d.completionByWeekLast8Weeks ?? [],
    progressHeatmapDow: d.progressHeatmapDow ?? [],
});