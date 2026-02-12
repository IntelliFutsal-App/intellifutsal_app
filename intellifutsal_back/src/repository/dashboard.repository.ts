import { AppDataSource } from "../config/app-source.config";


export class DashboardRepository {
    private async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
        return AppDataSource.manager.query(sql, params);
    }

    private toNumber = (v: any) => Number(v ?? 0);

    public getCoachActiveTeamIds = async (coachId: number): Promise<number[]> => {
        const rows = await this.query(
            `
      SELECT DISTINCT t.id AS "teamId"
      FROM coach_teams ct
      INNER JOIN teams t ON t.id = ct.teams_id AND t.status = true
      WHERE ct.coaches_id = $1
        AND ct.status = true
        AND ct.end_date IS NULL
      `,
            [coachId],
        );

        return rows.map((r) => Number(r.teamId));
    };

    public getPlayerActiveTeamIds = async (playerId: number): Promise<number[]> => {
        const rows = await this.query(
            `
      SELECT DISTINCT t.id AS "teamId"
      FROM player_teams pt
      INNER JOIN teams t ON t.id = pt.teams_id AND t.status = true
      WHERE pt.players_id = $1
        AND pt.status = true
        AND pt.exit_date IS NULL
      `,
            [playerId],
        );

        return rows.map((r) => Number(r.teamId));
    };

    public getCoachCards = async (teamIds: number[], coachId: number) => {
        if (teamIds.length === 0) {
            return {
                activeTeamsCount: 0,
                activePlayersCount: 0,
                pendingJoinRequestsCount: 0,
                activeAssignmentsCount: 0,
                completedAssignmentsCount: 0,
                cancelledAssignmentsCount: 0,
                progressTotalCount: 0,
                coachVerifiedCount: 0,
            };
        }

        const rows = await this.query(
            `
      WITH teams AS (
        SELECT UNNEST($1::int[]) AS team_id
      ),
      players_active AS (
        SELECT COUNT(*)::int AS cnt
        FROM player_teams pt
        INNER JOIN teams t ON t.team_id = pt.teams_id
        WHERE pt.status = true AND pt.exit_date IS NULL
      ),
      join_pending AS (
        SELECT COUNT(*)::int AS cnt
        FROM join_requests jr
        INNER JOIN teams t ON t.team_id = jr.teams_id
        WHERE jr.status = 'PENDING'
      ),
      assignments AS (
        SELECT
          SUM(CASE WHEN ta.status = 'ACTIVE' THEN 1 ELSE 0 END)::int AS active_cnt,
          SUM(CASE WHEN ta.status = 'COMPLETED' THEN 1 ELSE 0 END)::int AS completed_cnt,
          SUM(CASE WHEN ta.status = 'CANCELLED' THEN 1 ELSE 0 END)::int AS cancelled_cnt
        FROM training_assignments ta
        WHERE (ta.teams_id IN (SELECT team_id FROM teams) OR ta.assigned_by_coach_id = $2)
      ),
      progress AS (
        SELECT
          COUNT(*)::int AS total_cnt,
          SUM(CASE WHEN tp.coach_verified = true THEN 1 ELSE 0 END)::int AS verified_cnt
        FROM training_progress tp
        INNER JOIN training_assignments ta ON ta.id = tp.training_assignment_id
        WHERE (ta.teams_id IN (SELECT team_id FROM teams) OR ta.assigned_by_coach_id = $2)
      )
      SELECT
        (SELECT COUNT(*) FROM teams)::int AS "activeTeamsCount",
        (SELECT cnt FROM players_active) AS "activePlayersCount",
        (SELECT cnt FROM join_pending) AS "pendingJoinRequestsCount",
        (SELECT active_cnt FROM assignments) AS "activeAssignmentsCount",
        (SELECT completed_cnt FROM assignments) AS "completedAssignmentsCount",
        (SELECT cancelled_cnt FROM assignments) AS "cancelledAssignmentsCount",
        (SELECT total_cnt FROM progress) AS "progressTotalCount",
        (SELECT verified_cnt FROM progress) AS "coachVerifiedCount"
      `,
            [teamIds, coachId],
        );

        return rows[0] ?? {};
    };

    public getPlayerCards = async (playerId: number, teamIds: number[]) => {
        const teamCount = teamIds.length;

        const rows = await this.query(
            `
      WITH jr_pending AS (
        SELECT COUNT(*)::int AS cnt
        FROM join_requests jr
        WHERE jr.players_id = $1
          AND jr.status = 'PENDING'
      ),
      assignments AS (
        SELECT
          SUM(CASE WHEN ta.status = 'ACTIVE' THEN 1 ELSE 0 END)::int AS active_cnt,
          SUM(CASE WHEN ta.status = 'COMPLETED' THEN 1 ELSE 0 END)::int AS completed_cnt,
          SUM(CASE WHEN ta.status = 'CANCELLED' THEN 1 ELSE 0 END)::int AS cancelled_cnt
        FROM training_assignments ta
        WHERE (ta.players_id = $1 OR (ta.teams_id = ANY($2::int[])))
      ),
      progress AS (
        SELECT
          COUNT(*)::int AS total_cnt,
          SUM(CASE WHEN tp.coach_verified = true THEN 1 ELSE 0 END)::int AS verified_cnt,
          COALESCE(
            AVG(tp.completion_percentage)
              FILTER (WHERE tp.created_at >= (CURRENT_DATE - INTERVAL '29 days')),
            0
          )::float AS avg_30d
        FROM training_progress tp
        INNER JOIN training_assignments ta ON ta.id = tp.training_assignment_id
        WHERE (ta.players_id = $1 OR (ta.teams_id = ANY($2::int[])))
      )
      SELECT
        $3::int AS "activeTeamsCount",
        (SELECT cnt FROM jr_pending) AS "pendingJoinRequestsCount",
        (SELECT active_cnt FROM assignments) AS "activeAssignmentsCount",
        (SELECT completed_cnt FROM assignments) AS "completedAssignmentsCount",
        (SELECT cancelled_cnt FROM assignments) AS "cancelledAssignmentsCount",
        (SELECT total_cnt FROM progress) AS "progressTotalCount",
        (SELECT verified_cnt FROM progress) AS "coachVerifiedCount",
        (SELECT avg_30d FROM progress) AS "avgCompletionLast30Days"
      `,
            [playerId, teamIds, teamCount],
        );

        return rows[0] ?? {};
    };

    private getTeamsMini = async (teamIds: number[]) => {
        if (teamIds.length === 0) return [];
        return this.query(
            `
      SELECT
        t.id, t.name, t.category,
        COUNT(pt.id)::int AS "playerCount",
        COALESCE(AVG(DATE_PART('year', AGE(CURRENT_DATE, p.birth_date))), 0)::float AS "averageAge"
      FROM teams t
      LEFT JOIN player_teams pt
        ON pt.teams_id = t.id
        AND pt.status = true
        AND pt.exit_date IS NULL
      LEFT JOIN players p
        ON p.id = pt.players_id
        AND p.status = true
      WHERE t.id = ANY($1)
        AND t.status = true
      GROUP BY t.id
      ORDER BY t.name ASC
      `,
            [teamIds],
        );
    };

    public getCoachBaseDatasets = async (teamIds: number[]) => {
        const [teams, joinRequestsByStatus, positionsDistribution] = await Promise.all([
            this.getTeamsMini(teamIds),
            this.getCoachJoinRequestsByStatus(teamIds),
            this.getCoachPositionsDistribution(teamIds),
        ]);

        return {
            teams,
            joinRequestsByStatus,
            positionsDistribution,
        };
    };

    public getPlayerBaseDatasets = async (playerId: number, teamIds: number[]) => {
        const [teams, joinRequestsByStatus, assignmentsByStatus] = await Promise.all([
            this.getTeamsMini(teamIds),
            this.getPlayerJoinRequestsByStatus(playerId),
            this.getPlayerAssignmentsByStatus(playerId, teamIds),
        ]);

        return {
            teams,
            joinRequestsByStatus,
            assignmentsByStatus,
        };
    };

    public getCoachBaseDatasetsWithCoachId = async (teamIds: number[], coachId: number) => {
        const [
            trainingPlansByStatus,
            trainingPlansByOrigin,
            assignmentsByStatus,
            progressLast14Days,
            assignmentsLast14Days,
        ] = await Promise.all([
            this.getCoachTrainingPlansByStatus(coachId),
            this.getCoachTrainingPlansByOrigin(coachId),
            this.getCoachAssignmentsByStatus(teamIds, coachId),
            this.getCoachProgressLast14Days(teamIds, coachId),
            this.getCoachAssignmentsLast14Days(teamIds, coachId),
        ]);

        return {
            trainingPlansByStatus,
            trainingPlansByOrigin,
            assignmentsByStatus,
            progressLast14Days,
            assignmentsLast14Days,
        };
    };

    public getCoachAdvancedDatasets = async (args: {
        coachId: number;
        teamIds: number[];
        daysHeatmap: number;
        daysSeries: number;
        topN: number;
    }) => {
        const { coachId, teamIds, daysHeatmap, daysSeries, topN } = args;

        const [
            joinRequestsFunnel,
            progressHeatmapDow,
            trainingPlansByFocusArea,
            trainingPlansByDifficulty,
            teamActivity,
            joinRequestAvgReviewTime,
            progressLast30Days,
            assignmentsLast30Days,
        ] = await Promise.all([
            this.getCoachJoinRequestsFunnel(teamIds),
            this.getCoachProgressHeatmapDow(teamIds, daysHeatmap),
            this.getCoachPlansByFocusArea(coachId, topN),
            this.getCoachPlansByDifficulty(coachId, topN),
            this.getCoachTeamActivity(teamIds),
            this.getCoachJoinRequestAvgReviewTimeHours(teamIds),
            this.getTimeSeriesProgressByTeamIds(teamIds, daysSeries),
            this.getTimeSeriesAssignmentsByTeamIds(teamIds, daysSeries),
        ]);

        return {
            joinRequestsFunnel,
            progressHeatmapDow,
            trainingPlansByFocusArea,
            trainingPlansByDifficulty,
            teamActivity,
            joinRequestAvgReviewTime,
            progressLast30Days,
            assignmentsLast30Days,
        };
    };

    public getPlayerAdvancedDatasets = async (args: {
        playerId: number;
        daysHeatmap: number;
        daysSeries: number;
        weeks: number;
        streakWindowDays: number;
    }) => {
        const { playerId, daysHeatmap, daysSeries, weeks } = args;

        const [progressLast30Days, avgCompletionLast30Days, completionByWeekLast8Weeks, progressHeatmapDow, streakDays] =
            await Promise.all([
                this.getPlayerProgressTimeSeries(playerId, daysSeries),
                this.getPlayerAvgCompletionLast30Days(playerId),
                this.getPlayerCompletionByWeekLast8Weeks(playerId, weeks),
                this.getPlayerProgressHeatmapDow(playerId, daysHeatmap),
                this.getPlayerStreakDays(playerId),
            ]);

        return {
            progressLast30Days,
            avgCompletionLast30Days,
            completionByWeekLast8Weeks,
            progressHeatmapDow,
            streakDays,
        };
    };

    private getCoachJoinRequestsByStatus = async (teamIds: number[]) => {
        if (teamIds.length === 0) return [];
        return this.query(
            `
      SELECT jr.status AS status, COUNT(*)::int AS count
      FROM join_requests jr
      WHERE jr.teams_id = ANY($1)
      GROUP BY jr.status
      ORDER BY jr.status
      `,
            [teamIds],
        );
    };

    private getCoachTrainingPlansByStatus = async (coachId: number) => {
        return this.query(
            `
      SELECT tp.status AS status, COUNT(*)::int AS count
      FROM training_plans tp
      WHERE tp.created_by_coach_id = $1
      GROUP BY tp.status
      ORDER BY tp.status
      `,
            [coachId],
        );
    };

    private getCoachTrainingPlansByOrigin = async (coachId: number) => {
        return this.query(
            `
      SELECT
        CASE WHEN tp.generated_by_ai = true THEN 'AI' ELSE 'MANUAL' END AS origin,
        COUNT(*)::int AS count
      FROM training_plans tp
      WHERE tp.created_by_coach_id = $1
      GROUP BY origin
      ORDER BY origin
      `,
            [coachId],
        );
    };

    private getCoachAssignmentsByStatus = async (teamIds: number[], coachId: number) => {
        if (teamIds.length === 0) return [];
        return this.query(
            `
      SELECT ta.status AS status, COUNT(*)::int AS count
      FROM training_assignments ta
      WHERE (ta.teams_id = ANY($1) OR ta.assigned_by_coach_id = $2)
      GROUP BY ta.status
      ORDER BY ta.status
      `,
            [teamIds, coachId],
        );
    };

    private getCoachProgressLast14Days = async (teamIds: number[], coachId: number) => {
        if (teamIds.length === 0) return [];
        return this.query(
            `
      SELECT
        TO_CHAR(DATE(tp.created_at), 'YYYY-MM-DD') AS date,
        COUNT(*)::int AS count
      FROM training_progress tp
      INNER JOIN training_assignments ta ON ta.id = tp.training_assignment_id
      WHERE (ta.teams_id = ANY($1) OR ta.assigned_by_coach_id = $2)
        AND tp.created_at >= (CURRENT_DATE - INTERVAL '13 days')
      GROUP BY DATE(tp.created_at)
      ORDER BY DATE(tp.created_at)
      `,
            [teamIds, coachId],
        );
    };

    private getCoachAssignmentsLast14Days = async (teamIds: number[], coachId: number) => {
        if (teamIds.length === 0) return [];
        return this.query(
            `
      SELECT
        TO_CHAR(DATE(ta.created_at), 'YYYY-MM-DD') AS date,
        COUNT(*)::int AS count
      FROM training_assignments ta
      WHERE (ta.teams_id = ANY($1) OR ta.assigned_by_coach_id = $2)
        AND ta.created_at >= (CURRENT_DATE - INTERVAL '13 days')
      GROUP BY DATE(ta.created_at)
      ORDER BY DATE(ta.created_at)
      `,
            [teamIds, coachId],
        );
    };

    private getCoachPositionsDistribution = async (teamIds: number[]) => {
        if (teamIds.length === 0) return [];
        return this.query(
            `
      SELECT p.position AS position, COUNT(*)::int AS count
      FROM player_teams pt
      INNER JOIN players p ON p.id = pt.players_id AND p.status = true
      WHERE pt.teams_id = ANY($1)
        AND pt.status = true
        AND pt.exit_date IS NULL
      GROUP BY p.position
      ORDER BY count DESC
      `,
            [teamIds],
        );
    };

    private getPlayerJoinRequestsByStatus = async (playerId: number) => {
        return this.query(
            `
      SELECT jr.status AS status, COUNT(*)::int AS count
      FROM join_requests jr
      WHERE jr.players_id = $1
      GROUP BY jr.status
      ORDER BY jr.status
      `,
            [playerId],
        );
    };

    private getPlayerAssignmentsByStatus = async (playerId: number, teamIds: number[]) => {
        return this.query(
            `
      SELECT ta.status AS status, COUNT(*)::int AS count
      FROM training_assignments ta
      WHERE (ta.players_id = $1 OR ta.teams_id = ANY($2::int[]))
      GROUP BY ta.status
      ORDER BY ta.status
      `,
            [playerId, teamIds],
        );
    };

    private getCoachJoinRequestsFunnel = async (teamIds: number[]) => {
        if (teamIds.length === 0) return [];
        const rows = await this.query(
            `
      SELECT jr.status AS key, COUNT(*)::int AS count
      FROM join_requests jr
      WHERE jr.teams_id = ANY($1)
      GROUP BY jr.status
      ORDER BY jr.status
      `,
            [teamIds],
        );
        return rows.map((r: any) => ({ key: String(r.key), count: this.toNumber(r.count) }));
    };

    private getCoachJoinRequestAvgReviewTimeHours = async (teamIds: number[]) => {
        if (teamIds.length === 0) return [];
        const rows = await this.query(
            `
      SELECT jr.status AS status,
             COALESCE(AVG(EXTRACT(EPOCH FROM (jr.reviewed_at - jr.created_at)) / 3600.0), 0)::float AS "avgHours"
      FROM join_requests jr
      WHERE jr.teams_id = ANY($1)
        AND jr.reviewed_at IS NOT NULL
        AND jr.status IN ('APPROVED', 'REJECTED')
      GROUP BY jr.status
      ORDER BY jr.status
      `,
            [teamIds],
        );
        return rows.map((r: any) => ({ status: String(r.status), avgHours: Number(r.avgHours ?? 0) }));
    };

    private getCoachProgressHeatmapDow = async (teamIds: number[], days: number) => {
        if (teamIds.length === 0) return [];

        const rows = await this.query(
            `
      SELECT EXTRACT(DOW FROM tp.progress_date)::int AS "dayOfWeek",
             COUNT(*)::int AS "count"
      FROM training_progress tp
      INNER JOIN training_assignments ta ON ta.id = tp.training_assignment_id
      WHERE ta.teams_id = ANY($1)
        AND tp.progress_date >= (CURRENT_DATE - ($2::int))
      GROUP BY EXTRACT(DOW FROM tp.progress_date)
      ORDER BY "dayOfWeek"
      `,
            [teamIds, days],
        );

        const map = new Map<number, number>();
        for (const r of rows) map.set(Number(r.dayOfWeek), this.toNumber(r.count));

        const out: { dayOfWeek: number; count: number }[] = [];
        for (let d = 0; d <= 6; d++) out.push({ dayOfWeek: d, count: map.get(d) ?? 0 });
        return out;
    };

    private getCoachPlansByFocusArea = async (coachId: number, limit = 10) => {
        const rows = await this.query(
            `
      SELECT COALESCE(tp.focus_area, 'UNKNOWN') AS key,
             COUNT(*)::int AS count
      FROM training_plans tp
      WHERE tp.created_by_coach_id = $1
      GROUP BY COALESCE(tp.focus_area, 'UNKNOWN')
      ORDER BY count DESC
      LIMIT $2
      `,
            [coachId, limit],
        );

        return rows.map((r: any) => ({ key: String(r.key), count: this.toNumber(r.count) }));
    };

    private getCoachPlansByDifficulty = async (coachId: number, limit = 10) => {
        const rows = await this.query(
            `
      SELECT COALESCE(tp.difficulty, 'UNKNOWN') AS key,
             COUNT(*)::int AS count
      FROM training_plans tp
      WHERE tp.created_by_coach_id = $1
      GROUP BY COALESCE(tp.difficulty, 'UNKNOWN')
      ORDER BY count DESC
      LIMIT $2
      `,
            [coachId, limit],
        );

        return rows.map((r: any) => ({ key: String(r.key), count: this.toNumber(r.count) }));
    };

    private getCoachTeamActivity = async (teamIds: number[]) => {
        if (teamIds.length === 0) return [];

        const rows = await this.query(
            `
      WITH active_players AS (
        SELECT pt.teams_id AS team_id, COUNT(*)::int AS active_players
        FROM player_teams pt
        INNER JOIN players p ON p.id = pt.players_id AND p.status = true
        WHERE pt.teams_id = ANY($1)
          AND pt.status = true
          AND pt.exit_date IS NULL
        GROUP BY pt.teams_id
      ),
      progress_last_7 AS (
        SELECT ta.teams_id AS team_id, COUNT(DISTINCT ta.players_id)::int AS players_with_progress_7
        FROM training_progress tp
        INNER JOIN training_assignments ta ON ta.id = tp.training_assignment_id
        WHERE ta.teams_id = ANY($1)
          AND tp.progress_date >= (CURRENT_DATE - 7)
        GROUP BY ta.teams_id
      ),
      progress_last_28 AS (
        SELECT ta.teams_id AS team_id, COUNT(DISTINCT ta.players_id)::int AS players_with_progress_28
        FROM training_progress tp
        INNER JOIN training_assignments ta ON ta.id = tp.training_assignment_id
        WHERE ta.teams_id = ANY($1)
          AND tp.progress_date >= (CURRENT_DATE - 28)
        GROUP BY ta.teams_id
      )
      SELECT t.id AS "teamId",
             t.name AS "teamName",
             COALESCE(ap.active_players, 0)::int AS "activePlayers",
             COALESCE(p7.players_with_progress_7, 0)::int AS "playersWithProgressLast7Days",
             COALESCE(p28.players_with_progress_28, 0)::int AS "playersWithProgressLast28Days"
      FROM teams t
      LEFT JOIN active_players ap ON ap.team_id = t.id
      LEFT JOIN progress_last_7 p7 ON p7.team_id = t.id
      LEFT JOIN progress_last_28 p28 ON p28.team_id = t.id
      WHERE t.id = ANY($1) AND t.status = true
      ORDER BY t.name
      `,
            [teamIds],
        );

        return rows.map((r: any) => ({
            teamId: Number(r.teamId),
            teamName: String(r.teamName),
            activePlayers: this.toNumber(r.activePlayers),
            playersWithProgressLast7Days: this.toNumber(r.playersWithProgressLast7Days),
            playersWithProgressLast28Days: this.toNumber(r.playersWithProgressLast28Days),
        }));
    };

    private getTimeSeriesProgressByTeamIds = async (teamIds: number[], days: number) => {
        if (teamIds.length === 0) return [];

        const rows = await this.query(
            `
      SELECT tp.progress_date::date AS date,
             COUNT(*)::int AS count
      FROM training_progress tp
      INNER JOIN training_assignments ta ON ta.id = tp.training_assignment_id
      WHERE ta.teams_id = ANY($1)
        AND tp.progress_date >= (CURRENT_DATE - ($2::int))
      GROUP BY tp.progress_date::date
      ORDER BY tp.progress_date::date
      `,
            [teamIds, days],
        );

        return rows.map((r: any) => ({ date: String(r.date), count: this.toNumber(r.count) }));
    };

    private getTimeSeriesAssignmentsByTeamIds = async (teamIds: number[], days: number) => {
        if (teamIds.length === 0) return [];

        const rows = await this.query(
            `
      SELECT ta.created_at::date AS date,
             COUNT(*)::int AS count
      FROM training_assignments ta
      WHERE ta.teams_id = ANY($1)
        AND ta.created_at >= (NOW() - ($2::int || ' days')::interval)
      GROUP BY ta.created_at::date
      ORDER BY ta.created_at::date
      `,
            [teamIds, days],
        );

        return rows.map((r: any) => ({ date: String(r.date), count: this.toNumber(r.count) }));
    };

    private getPlayerProgressHeatmapDow = async (playerId: number, days: number) => {
        const rows = await this.query(
            `
      SELECT EXTRACT(DOW FROM tp.progress_date)::int AS "dayOfWeek",
             COUNT(*)::int AS "count"
      FROM training_progress tp
      INNER JOIN training_assignments ta ON ta.id = tp.training_assignment_id
      WHERE ta.players_id = $1
        AND tp.progress_date >= (CURRENT_DATE - ($2::int))
      GROUP BY EXTRACT(DOW FROM tp.progress_date)
      ORDER BY "dayOfWeek"
      `,
            [playerId, days],
        );

        const map = new Map<number, number>();
        for (const r of rows) map.set(Number(r.dayOfWeek), this.toNumber(r.count));

        const out: { dayOfWeek: number; count: number }[] = [];
        for (let d = 0; d <= 6; d++) out.push({ dayOfWeek: d, count: map.get(d) ?? 0 });
        return out;
    };

    private getPlayerProgressTimeSeries = async (playerId: number, days: number) => {
        const rows = await this.query(
            `
      SELECT tp.progress_date::date AS date,
             COUNT(*)::int AS count
      FROM training_progress tp
      INNER JOIN training_assignments ta ON ta.id = tp.training_assignment_id
      WHERE ta.players_id = $1
        AND tp.progress_date >= (CURRENT_DATE - ($2::int))
      GROUP BY tp.progress_date::date
      ORDER BY tp.progress_date::date
      `,
            [playerId, days],
        );

        return rows.map((r: any) => ({ date: String(r.date), count: this.toNumber(r.count) }));
    };

    private getPlayerAvgCompletionLast30Days = async (playerId: number) => {
        const row = await this.query(
            `
      SELECT COALESCE(AVG(tp.completion_percentage), 0)::float AS avg
      FROM training_progress tp
      INNER JOIN training_assignments ta ON ta.id = tp.training_assignment_id
      WHERE ta.players_id = $1
        AND tp.progress_date >= (CURRENT_DATE - 30)
      `,
            [playerId],
        );

        return Number(row?.[0]?.avg ?? 0);
    };

    private getPlayerCompletionByWeekLast8Weeks = async (playerId: number, weeks = 8) => {
        const days = weeks * 7;

        const rows = await this.query(
            `
      SELECT TO_CHAR(DATE_TRUNC('week', tp.progress_date), 'IYYY-"W"IW') AS week,
             COALESCE(AVG(tp.completion_percentage), 0)::float AS value
      FROM training_progress tp
      INNER JOIN training_assignments ta ON ta.id = tp.training_assignment_id
      WHERE ta.players_id = $1
        AND tp.progress_date >= (CURRENT_DATE - $2::int)
      GROUP BY DATE_TRUNC('week', tp.progress_date)
      ORDER BY DATE_TRUNC('week', tp.progress_date)
      `,
            [playerId, days],
        );

        return rows.map((r: any) => ({ week: String(r.week), value: Number(r.value ?? 0) }));
    };

    private getPlayerStreakDays = async (playerId: number) => {
        const rows = await this.query(
            `
      SELECT DISTINCT tp.progress_date::date AS d
      FROM training_progress tp
      INNER JOIN training_assignments ta ON ta.id = tp.training_assignment_id
      WHERE ta.players_id = $1
        AND tp.progress_date >= (CURRENT_DATE - 90)
      ORDER BY d DESC
      `,
            [playerId],
        );

        const dates = rows.map((r: any) => String(r.d));
        const set = new Set(dates);

        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 90; i++) {
            const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
            d.setUTCDate(d.getUTCDate() - i);
            const key = d.toISOString().slice(0, 10);
            if (set.has(key)) streak++;
            else break;
        }

        return streak;
    };
}