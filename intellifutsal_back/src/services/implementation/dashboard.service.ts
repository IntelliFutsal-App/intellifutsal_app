import { NotFoundException, UnauthorizedException } from "../../exceptions";
import { CoachRepository, CredentialRepository, PlayerRepository } from "../../repository";
import { DashboardRepository } from "../../repository/dashboard.repository";
import { DashboardMapper } from "../../mappers/dashboard.mapper";
import { COACH_NOT_FOUND_CREDENTIAL, CREDENTIAL_NOT_FOUND, INACTIVE_CREDENTIAL, PLAYER_NOT_FOUND_CREDENTIAL } from "../../utilities/messages.utility";
import { CoachDashboardResponse, PlayerDashboardResponse } from "../../interfaces";
import { IDashboardService } from "../dashboard.service.interface";


export class DashboardService implements IDashboardService {
    private readonly credentialRepository: CredentialRepository;
    private readonly playerRepository: PlayerRepository;
    private readonly coachRepository: CoachRepository;
    private readonly dashboardRepository: DashboardRepository;

    constructor() {
        this.credentialRepository = new CredentialRepository();
        this.playerRepository = new PlayerRepository();
        this.coachRepository = new CoachRepository();
        this.dashboardRepository = new DashboardRepository();
    }

    public getCoachDashboard = async (credentialId: number): Promise<CoachDashboardResponse> => {
        const credential = await this.credentialRepository.findById(credentialId);
        if (!credential) throw new NotFoundException(`${CREDENTIAL_NOT_FOUND}${credentialId}`);
        if (!credential.status) throw new UnauthorizedException(INACTIVE_CREDENTIAL);

        const coach = await this.coachRepository.findByCredentialId(credentialId);
        if (!coach) throw new NotFoundException(`${COACH_NOT_FOUND_CREDENTIAL}${credentialId}`);

        const teamIds = await this.dashboardRepository.getCoachActiveTeamIds(coach.id);

        const cards = await this.dashboardRepository.getCoachCards(teamIds, coach.id);
        const baseA = await this.dashboardRepository.getCoachBaseDatasets(teamIds);
        const baseB = await this.dashboardRepository.getCoachBaseDatasetsWithCoachId(teamIds, coach.id);
        const advanced = await this.dashboardRepository.getCoachAdvancedDatasets({
            coachId: coach.id,
            teamIds,
            daysHeatmap: 30,
            daysSeries: 30,
            topN: 10,
        });

        return DashboardMapper.coachDashboard({
            cards,
            teams: baseA.teams,
            joinRequestsByStatus: baseA.joinRequestsByStatus,
            trainingPlansByStatus: baseB.trainingPlansByStatus,
            trainingPlansByOrigin: baseB.trainingPlansByOrigin,
            assignmentsByStatus: baseB.assignmentsByStatus,
            progressLast14Days: baseB.progressLast14Days,
            assignmentsLast14Days: baseB.assignmentsLast14Days,
            positionsDistribution: baseA.positionsDistribution,
            joinRequestsFunnel: advanced.joinRequestsFunnel,
            progressHeatmapDow: advanced.progressHeatmapDow,
            trainingPlansByFocusArea: advanced.trainingPlansByFocusArea,
            trainingPlansByDifficulty: advanced.trainingPlansByDifficulty,
            teamActivity: advanced.teamActivity,
            joinRequestAvgReviewTime: advanced.joinRequestAvgReviewTime,
            progressLast30Days: advanced.progressLast30Days,
            assignmentsLast30Days: advanced.assignmentsLast30Days,
        });
    };

    public getPlayerDashboard = async (credentialId: number): Promise<PlayerDashboardResponse> => {
        const credential = await this.credentialRepository.findById(credentialId);
        if (!credential) throw new NotFoundException(`${CREDENTIAL_NOT_FOUND}${credentialId}`);
        if (!credential.status) throw new UnauthorizedException(INACTIVE_CREDENTIAL);

        const player = await this.playerRepository.findByCredentialId(credentialId);
        if (!player) throw new NotFoundException(`${PLAYER_NOT_FOUND_CREDENTIAL}${credentialId}`);

        const teamIds = await this.dashboardRepository.getPlayerActiveTeamIds(player.id);
        const cards = await this.dashboardRepository.getPlayerCards(player.id, teamIds);
        const base = await this.dashboardRepository.getPlayerBaseDatasets(player.id, teamIds);

        const advanced = await this.dashboardRepository.getPlayerAdvancedDatasets({
            playerId: player.id,
            daysHeatmap: 30,
            daysSeries: 30,
            weeks: 8,
            streakWindowDays: 90,
        });

        return DashboardMapper.playerDashboard({
            cards,
            teams: base.teams,
            joinRequestsByStatus: base.joinRequestsByStatus,
            assignmentsByStatus: base.assignmentsByStatus,
            progressLast30Days: advanced.progressLast30Days,
            avgCompletionLast30Days: advanced.avgCompletionLast30Days,
            completionByWeekLast8Weeks: advanced.completionByWeekLast8Weeks,
            progressHeatmapDow: advanced.progressHeatmapDow,
            streakDays: advanced.streakDays,
        });
    };
}