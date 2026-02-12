import { createTeamSchema, updateStatusSchema, updateTeamSchema } from "../../dto";
import { ConflictException, InternalServerException, NotFoundException } from "../../exceptions";
import { CreateTeamRequest, TeamResponse, UpdateStatusRequest, UpdateTeamRequest } from "../../interfaces";
import { TeamMapper } from "../../mappers";
import { Credential, Team } from "../../models";
import { CoachRepository, CoachTeamRepository, CredentialRepository, PlayerRepository, PlayerTeamRepository, TeamRepository } from "../../repository";
import { CREDENTIAL_NOT_FOUND, CREDENTIAL_WITHOUT_PROFILE, INTERNAL_SERVER_ERROR, TEAM_NAME_ALREADY_EXISTS, TEAM_NOT_FOUND, TEAM_SAVE_ERROR, TEAM_UPDATE_ERROR } from "../../utilities/messages.utility";
import { validateRequest } from "../../utilities/validations.utility";
import { ITeamService } from "../team.service.interface";


export class TeamService implements ITeamService {
    private readonly teamRepository: TeamRepository;
    private readonly credentialRepository: CredentialRepository;
    private readonly playerRepository: PlayerRepository;
    private readonly coachRepository: CoachRepository;
    private readonly playerTeamRepository: PlayerTeamRepository;
    private readonly coachTeamRepository: CoachTeamRepository;

    constructor() {
        this.teamRepository = new TeamRepository();
        this.credentialRepository = new CredentialRepository();
        this.playerRepository = new PlayerRepository();
        this.coachRepository = new CoachRepository();
        this.playerTeamRepository = new PlayerTeamRepository();
        this.coachTeamRepository = new CoachTeamRepository();
    }

    public findAll = async (): Promise<TeamResponse[]> => {
        const teams = await this.teamRepository.findAll();
        const ids = teams.map(t => t.id);
        const statsMap = await this.teamRepository.getStatsByTeamIds(ids);

        return TeamMapper.toResponseList(teams, statsMap);
    }

    public findAllIncludingInactive = async (): Promise<TeamResponse[]> => {
        const teams = await this.teamRepository.findAllIncludingInactive();
        const ids = teams.filter(t => t.status).map(t => t.id);
        const statsMap = await this.teamRepository.getStatsByTeamIds(ids);

        return TeamMapper.toResponseList(teams, statsMap);
    }

    public findById = async (id: number): Promise<TeamResponse> => {
        const team = await this.findTeamOrThrow(id);
        const stats = await this.teamRepository.getTeamStats(team.id);

        return TeamMapper.toResponse(team, stats);
    }

    public findByIdIncludingInactive = async (id: number): Promise<TeamResponse> => {
        const team = await this.findTeamIncludingInactiveOrThrow(id);
        const stats = await this.teamRepository.getTeamStats(team.id);

        return TeamMapper.toResponse(team, stats);
    }

    public findMyTeams = async (credentialId: number): Promise<TeamResponse[]> => {
        await this.findCredentialOrThrow(credentialId);

        const player = await this.playerRepository.findByCredentialId(credentialId);
        const coach = await this.coachRepository.findByCredentialId(credentialId);

        if (!player && !coach) throw new NotFoundException(CREDENTIAL_WITHOUT_PROFILE);

        let teamIds: number[] = [];
        if (player) {
            teamIds = await this.playerTeamRepository.findActiveTeamIdsByPlayerId(player.id);
        } else if (coach) {
            teamIds = await this.coachTeamRepository.findActiveTeamIdsByCoachId(coach.id);
        }

        const sanitizedTeamIds = (teamIds ?? [])
            .map(id => Number(id))
            .filter(id => Number.isFinite(id) && id > 0);
        if (sanitizedTeamIds.length === 0) return [];

        const teams = await this.teamRepository.findByIds(sanitizedTeamIds);
        const statsByTeamId = await this.teamRepository.getStatsByTeamIds(teams.map(t => t.id));
        
        return TeamMapper.toResponseList(teams, statsByTeamId);
    }

    public save = async (createTeamRequest: CreateTeamRequest): Promise<TeamResponse> => {
        await this.ensureTeamNameIsUnique(createTeamRequest.name);
        const validatedRequest = validateRequest(createTeamSchema, createTeamRequest);

        const team = TeamMapper.toEntity(validatedRequest);
        const savedTeam = await this.teamRepository.save(team);
        if (!savedTeam) throw new InternalServerException(`${INTERNAL_SERVER_ERROR}${TEAM_SAVE_ERROR}`);

        return TeamMapper.toResponse(savedTeam);
    }

    public update = async (updateTeamRequest: UpdateTeamRequest): Promise<TeamResponse> => {
        const currentTeam = await this.findTeamOrThrow(updateTeamRequest.id);
        const validatedRequest = validateRequest(updateTeamSchema, updateTeamRequest);

        if (validatedRequest.name && validatedRequest.name !== currentTeam.name) {
            await this.ensureTeamNameIsUnique(validatedRequest.name, currentTeam.id);
        }

        const team = TeamMapper.toUpdateEntity(validatedRequest);
        const updatedTeam = await this.teamRepository.update(team);
        if (!updatedTeam) throw new InternalServerException(`${INTERNAL_SERVER_ERROR}${TEAM_UPDATE_ERROR}`);

        const statsMap = await this.teamRepository.getStatsByTeamIds([updatedTeam.id]);
        return TeamMapper.toResponse(updatedTeam, statsMap.get(updatedTeam.id));
    }

    public delete = async (id: number): Promise<void> => {
        await this.findTeamOrThrow(id);
        await this.teamRepository.delete(id);
    }

    public updateStatus = async (id: number, updateStatusRequest: UpdateStatusRequest): Promise<TeamResponse> => {
        const team = await this.findTeamIncludingInactiveOrThrow(id);
        const validatedRequest = validateRequest(updateStatusSchema, updateStatusRequest);

        team.status = validatedRequest.status;
        const updatedTeam = await this.teamRepository.update(team);
        if (!updatedTeam) throw new InternalServerException(`${INTERNAL_SERVER_ERROR}${TEAM_UPDATE_ERROR}`);

        const statsMap = updatedTeam.status
            ? await this.teamRepository.getStatsByTeamIds([updatedTeam.id])
            : new Map<number, any>();

        return TeamMapper.toResponse(updatedTeam, statsMap.get(updatedTeam.id));
    }

    private findTeamOrThrow = async (id: number): Promise<Team> => {
        const team = await this.teamRepository.findById(id);

        if (!team) throw new NotFoundException(`${TEAM_NOT_FOUND}${id}`);

        return team;
    }

    private findTeamIncludingInactiveOrThrow = async (id: number): Promise<Team> => {
        const team = await this.teamRepository.findByIdIncludingInactive(id);

        if (!team) throw new NotFoundException(`${TEAM_NOT_FOUND}${id}`);

        return team;
    }

    private findCredentialOrThrow = async (id: number): Promise<Credential> => {
        const credential = await this.credentialRepository.findById(id);
        
        if (!credential) throw new NotFoundException(`${ CREDENTIAL_NOT_FOUND }${ id }`);
        
        return credential;
    }
    

    private ensureTeamNameIsUnique = async (name: string, excludeId?: number): Promise<void> => {
        const existingName = await this.teamRepository.findByNameExcludingId(name, excludeId);

        if (existingName) throw new ConflictException(`${TEAM_NAME_ALREADY_EXISTS}${name}`);
    }
}