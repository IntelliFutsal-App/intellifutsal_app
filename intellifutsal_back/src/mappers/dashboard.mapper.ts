import { CoachDashboardResponse, PlayerDashboardResponse, TeamMiniResponse, CountByStatusResponse, TimeSeriesPointResponse, PositionDistributionResponse, CountByKeyResponse, DayOfWeekPointResponse, JoinRequestReviewTimeResponse, TeamActivityResponse, WeekSeriesPointResponse } from "../interfaces/dashboard";


export class DashboardMapper {
    static toTeamMiniList(teamMiniResponses: any[]): TeamMiniResponse[] {
        return (teamMiniResponses ?? []).map((r) => {
            const teamMiniResponse = new TeamMiniResponse();

            teamMiniResponse.id = Number(r.id);
            teamMiniResponse.name = String(r.name);
            teamMiniResponse.category = String(r.category);
            teamMiniResponse.playerCount = Number(r.playerCount ?? 0);
            teamMiniResponse.averageAge = Number(r.averageAge ?? 0);
            
            return teamMiniResponse;
        });
    }

    static toCountByStatus(rows: any[], statusKey = "status", countKey = "count"): CountByStatusResponse[] {
        return (rows ?? []).map((r) => {
            const countByStatusResponse = new CountByStatusResponse();

            countByStatusResponse.status = String(r[statusKey]);
            countByStatusResponse.count = Number(r[countKey] ?? 0);
            
            return countByStatusResponse;
        });
    }

    static toCountByKey(rows: any[], keyKey = "key", countKey = "count"): CountByKeyResponse[] {
        return (rows ?? []).map((r) => {
            const countByKeyResponse = new CountByKeyResponse();

            countByKeyResponse.key = String(r[keyKey]);
            countByKeyResponse.count = Number(r[countKey] ?? 0);
            
            return countByKeyResponse;
        });
    }

    static toTimeSeries(rows: any[]): TimeSeriesPointResponse[] {
        return (rows ?? []).map((r) => {
            const timeSeriesPointResponse = new TimeSeriesPointResponse();

            timeSeriesPointResponse.date = r.date;
            timeSeriesPointResponse.count = Number(r.count ?? 0);
            
            return timeSeriesPointResponse;
        });
    }

    static toPositions(rows: any[]): PositionDistributionResponse[] {
        return (rows ?? []).map((r) => {
            const positionDistributionResponse = new PositionDistributionResponse();

            positionDistributionResponse.position = String(r.position);
            positionDistributionResponse.count = Number(r.count ?? 0);
            
            return positionDistributionResponse;
        });
    }

    static toHeatmapDow(rows: any[]): DayOfWeekPointResponse[] {
        return (rows ?? []).map((r) => {
            const dayOfWeekPointResponse = new DayOfWeekPointResponse();

            dayOfWeekPointResponse.dayOfWeek = Number(r.dayOfWeek ?? 0);
            dayOfWeekPointResponse.count = Number(r.count ?? 0);
            
            return dayOfWeekPointResponse;
        });
    }

    static toTeamActivity(rows: any[]): TeamActivityResponse[] {
        return (rows ?? []).map((r) => {
            const teamActivityResponse = new TeamActivityResponse();

            teamActivityResponse.teamId = Number(r.teamId);
            teamActivityResponse.teamName = String(r.teamName);
            teamActivityResponse.activePlayers = Number(r.activePlayers ?? 0);
            teamActivityResponse.playersWithProgressLast7Days = Number(r.playersWithProgressLast7Days ?? 0);
            teamActivityResponse.playersWithProgressLast28Days = Number(r.playersWithProgressLast28Days ?? 0);
            
            return teamActivityResponse;
        });
    }

    static toAvgReview(rows: any[]): JoinRequestReviewTimeResponse[] {
        return (rows ?? []).map((r) => {
            const joinRequestReviewTimeResponse = new JoinRequestReviewTimeResponse();

            joinRequestReviewTimeResponse.status = String(r.status);
            joinRequestReviewTimeResponse.avgHours = Number(r.avgHours ?? 0);
            
            return joinRequestReviewTimeResponse;
        });
    }

    static toWeekSeries(rows: any[]): WeekSeriesPointResponse[] {
        return (rows ?? []).map((r) => {
            const weekSeriesPointResponse = new WeekSeriesPointResponse();

            weekSeriesPointResponse.week = String(r.week);
            weekSeriesPointResponse.value = Number(r.value ?? 0);
            
            return weekSeriesPointResponse;
        });
    }

    static coachDashboard(params: {
        cards: any;
        teams: any[];
        joinRequestsByStatus: any[];
        trainingPlansByStatus: any[];
        trainingPlansByOrigin: any[];
        assignmentsByStatus: any[];
        progressLast14Days: any[];
        assignmentsLast14Days: any[];
        positionsDistribution: any[];
        joinRequestsFunnel?: any[];
        progressHeatmapDow?: any[];
        trainingPlansByFocusArea?: any[];
        trainingPlansByDifficulty?: any[];
        teamActivity?: any[];
        joinRequestAvgReviewTime?: any[];
        progressLast30Days?: any[];
        assignmentsLast30Days?: any[];
    }): CoachDashboardResponse {
        const coachDashboardResponse = new CoachDashboardResponse();

        coachDashboardResponse.activeTeamsCount = Number(params.cards?.activeTeamsCount ?? 0);
        coachDashboardResponse.activePlayersCount = Number(params.cards?.activePlayersCount ?? 0);
        coachDashboardResponse.pendingJoinRequestsCount = Number(params.cards?.pendingJoinRequestsCount ?? 0);
        coachDashboardResponse.activeAssignmentsCount = Number(params.cards?.activeAssignmentsCount ?? 0);
        coachDashboardResponse.completedAssignmentsCount = Number(params.cards?.completedAssignmentsCount ?? 0);
        coachDashboardResponse.cancelledAssignmentsCount = Number(params.cards?.cancelledAssignmentsCount ?? 0);
        coachDashboardResponse.progressTotalCount = Number(params.cards?.progressTotalCount ?? 0);
        coachDashboardResponse.coachVerifiedCount = Number(params.cards?.coachVerifiedCount ?? 0);
        coachDashboardResponse.coachVerificationRate =
            coachDashboardResponse.progressTotalCount === 0
                ? 0
                : Number(((coachDashboardResponse.coachVerifiedCount / coachDashboardResponse.progressTotalCount) * 100).toFixed(2));
        coachDashboardResponse.teams = this.toTeamMiniList(params.teams);
        coachDashboardResponse.joinRequestsByStatus = this.toCountByStatus(params.joinRequestsByStatus);
        coachDashboardResponse.trainingPlansByStatus = this.toCountByStatus(params.trainingPlansByStatus);
        coachDashboardResponse.trainingPlansByOrigin = this.toCountByStatus(params.trainingPlansByOrigin, "origin", "count");
        coachDashboardResponse.assignmentsByStatus = this.toCountByStatus(params.assignmentsByStatus);
        coachDashboardResponse.progressLast14Days = this.toTimeSeries(params.progressLast14Days);
        coachDashboardResponse.assignmentsLast14Days = this.toTimeSeries(params.assignmentsLast14Days);
        coachDashboardResponse.positionsDistribution = this.toPositions(params.positionsDistribution);
        coachDashboardResponse.joinRequestsFunnel = this.toCountByKey(params.joinRequestsFunnel ?? []);

        const totalJR = coachDashboardResponse.joinRequestsFunnel.reduce((acc, x) => acc + x.count, 0);
        const approvedJR = coachDashboardResponse.joinRequestsFunnel.find((x) => x.key === "APPROVED")?.count ?? 0;
        coachDashboardResponse.joinRequestConversionRate = totalJR === 0 ? 0 : Number(((approvedJR / totalJR) * 100).toFixed(2));
        coachDashboardResponse.progressHeatmapDow = this.toHeatmapDow(params.progressHeatmapDow ?? []);
        coachDashboardResponse.trainingPlansByFocusArea = this.toCountByKey(params.trainingPlansByFocusArea ?? []);
        coachDashboardResponse.trainingPlansByDifficulty = this.toCountByKey(params.trainingPlansByDifficulty ?? []);
        coachDashboardResponse.teamActivity = this.toTeamActivity(params.teamActivity ?? []);
        coachDashboardResponse.joinRequestAvgReviewTime = this.toAvgReview(params.joinRequestAvgReviewTime ?? []);
        coachDashboardResponse.progressLast30Days = this.toTimeSeries(params.progressLast30Days ?? []);
        coachDashboardResponse.assignmentsLast30Days = this.toTimeSeries(params.assignmentsLast30Days ?? []);

        return coachDashboardResponse;
    }

    static playerDashboard(params: {
        cards: any;
        teams: any[];
        joinRequestsByStatus: any[];
        assignmentsByStatus: any[];
        progressLast30Days: any[];
        avgCompletionLast30Days?: any;
        completionByWeekLast8Weeks?: any[];
        progressHeatmapDow?: any[];
        streakDays?: any;
    }): PlayerDashboardResponse {
        const playerDashboardResponse = new PlayerDashboardResponse();

        playerDashboardResponse.activeTeamsCount = Number(params.cards?.activeTeamsCount ?? 0);
        playerDashboardResponse.pendingJoinRequestsCount = Number(params.cards?.pendingJoinRequestsCount ?? 0);
        playerDashboardResponse.activeAssignmentsCount = Number(params.cards?.activeAssignmentsCount ?? 0);
        playerDashboardResponse.completedAssignmentsCount = Number(params.cards?.completedAssignmentsCount ?? 0);
        playerDashboardResponse.cancelledAssignmentsCount = Number(params.cards?.cancelledAssignmentsCount ?? 0);
        playerDashboardResponse.progressTotalCount = Number(params.cards?.progressTotalCount ?? 0);
        playerDashboardResponse.coachVerifiedCount = Number(params.cards?.coachVerifiedCount ?? 0);
        playerDashboardResponse.coachVerificationRate =
            playerDashboardResponse.progressTotalCount === 0
                ? 0
                : Number(((playerDashboardResponse.coachVerifiedCount / playerDashboardResponse.progressTotalCount) * 100).toFixed(2));
        playerDashboardResponse.avgCompletionLast30Days = Number(params.avgCompletionLast30Days ?? params.cards?.avgCompletionLast30Days ?? 0);
        playerDashboardResponse.teams = this.toTeamMiniList(params.teams);
        playerDashboardResponse.joinRequestsByStatus = this.toCountByStatus(params.joinRequestsByStatus);
        playerDashboardResponse.assignmentsByStatus = this.toCountByStatus(params.assignmentsByStatus);
        playerDashboardResponse.progressLast30Days = this.toTimeSeries(params.progressLast30Days);
        playerDashboardResponse.completionByWeekLast8Weeks = this.toWeekSeries(params.completionByWeekLast8Weeks ?? []);
        playerDashboardResponse.progressHeatmapDow = this.toHeatmapDow(params.progressHeatmapDow ?? []);
        playerDashboardResponse.streakDays = Number(params.streakDays ?? 0);

        return playerDashboardResponse;
    }
}