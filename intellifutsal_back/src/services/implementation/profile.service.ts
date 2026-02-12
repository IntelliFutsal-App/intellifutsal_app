import { NotFoundException, UnauthorizedException } from "../../exceptions";
import { ProfileStateResponse, Role } from "../../interfaces";
import { CoachMapper, PlayerMapper, TeamMapper } from "../../mappers";
import { Team } from "../../models";
import { CoachRepository, CoachTeamRepository, CredentialRepository, PlayerRepository, PlayerTeamRepository, TeamRepository } from "../../repository";
import { COACH_NOT_FOUND_CREDENTIAL, CREDENTIAL_NOT_FOUND, INACTIVE_CREDENTIAL, PLAYER_NOT_FOUND_CREDENTIAL, ROLE_NOT_SUPPORTED } from "../../utilities/messages.utility";
import { IProfileService } from "../profile.service.interface";


export class ProfileService implements IProfileService {
    private readonly credentialRepository: CredentialRepository;
    private readonly playerRepository: PlayerRepository;
    private readonly coachRepository: CoachRepository;
    private readonly playerTeamRepository: PlayerTeamRepository;
    private readonly coachTeamRepository: CoachTeamRepository;
    private readonly teamRepository: TeamRepository;

    constructor() {
        this.credentialRepository = new CredentialRepository();
        this.playerRepository = new PlayerRepository();
        this.coachRepository = new CoachRepository();
        this.playerTeamRepository = new PlayerTeamRepository();
        this.coachTeamRepository = new CoachTeamRepository();
        this.teamRepository = new TeamRepository();
    }

    public getMyState = async (credentialId: number): Promise<ProfileStateResponse> => {
        const credential = await this.credentialRepository.findById(credentialId);
        if (!credential) throw new NotFoundException(`${ CREDENTIAL_NOT_FOUND }${ credentialId }`);
        if (!credential.status) throw new UnauthorizedException(INACTIVE_CREDENTIAL);

        if (credential.role === Role.PLAYER) {
            const player = await this.playerRepository.findByCredentialId(credentialId);
            if (!player) throw new NotFoundException(`${ PLAYER_NOT_FOUND_CREDENTIAL }${ credentialId }`);

            const teamIds = await this.playerTeamRepository.findActiveTeamIdsByPlayerId(player.id);
            const teams = await this.buildTeamResponses(teamIds);

            return {
                type: Role.PLAYER,
                profile: PlayerMapper.toResponse(player),
                teams,
            };
        } if (credential.role === Role.COACH) {
            const coach = await this.coachRepository.findByCredentialId(credentialId);
            if (!coach) throw new NotFoundException(`${ COACH_NOT_FOUND_CREDENTIAL }${ credentialId }`);

            const teamIds = await this.coachTeamRepository.findActiveTeamIdsByCoachId(coach.id);
            const teams = await this.buildTeamResponses(teamIds);

            return {
                type: Role.COACH,
                profile: CoachMapper.toResponse(coach),
                teams,
            };
        }

        throw new UnauthorizedException(ROLE_NOT_SUPPORTED);
    };

    private buildTeamResponses = async (teamIds: number[]) => {
        if (teamIds.length === 0) return [];

        const teams = await this.teamRepository.findByIds(teamIds);
        const statsMap = await this.teamRepository.getStatsByTeamIds(teamIds);

        const byId = new Map(teams.map(t => [t.id, t]));
        const orderedTeams = teamIds.map(id => byId.get(id)).filter(Boolean) as Team[];

        return TeamMapper.toResponseList(orderedTeams, statsMap);
    };
}