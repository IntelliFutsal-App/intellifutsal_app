import { createPlayerTeamSchema, updatePlayerTeamSchema, updateStatusSchema } from "../../dto";
import { BadRequestException, ConflictException, InternalServerException, NotFoundException } from "../../exceptions";
import { CreatePlayerTeamRequest, OnboardingStatus, PlayerTeamResponse, UpdatePlayerTeamRequest, UpdateStatusRequest } from "../../interfaces";
import { PlayerTeamMapper } from "../../mappers";
import { Player, PlayerTeam, Team } from "../../models";
import { CredentialRepository, JoinRequestRepository, PlayerRepository, PlayerTeamRepository, TeamRepository } from "../../repository";
import { CREDENTIAL_NOT_FOUND, INTERNAL_SERVER_ERROR, PLAYER_NOT_FOUND, PLAYER_TEAM_ALREADY_ASSOCIATED, PLAYER_TEAM_ENTRY_DATE_FUTURE_ERROR, PLAYER_TEAM_EXIT_DATE_BEFORE_ENTRY_ERROR, PLAYER_TEAM_EXIT_DATE_FUTURE_ERROR, PLAYER_TEAM_NOT_FOUND, PLAYER_TEAM_SAVE_ERROR, PLAYER_TEAM_UPDATE_ERROR, TEAM_NOT_FOUND } from "../../utilities/messages.utility";
import { validateRequest } from "../../utilities/validations.utility";
import { IPlayerTeamService } from "../player-team.service.interface";


export class PlayerTeamService implements IPlayerTeamService {
    private readonly playerTeamRepository: PlayerTeamRepository;
    private readonly playerRepository: PlayerRepository;
    private readonly teamRepository: TeamRepository;
    private readonly credentialRepository: CredentialRepository;
    private readonly joinRequestRepository: JoinRequestRepository;

    constructor() {
        this.playerTeamRepository = new PlayerTeamRepository();
        this.playerRepository = new PlayerRepository();
        this.teamRepository = new TeamRepository();
        this.credentialRepository = new CredentialRepository();
        this.joinRequestRepository = new JoinRequestRepository();
    }

    public findAll = async (): Promise<PlayerTeamResponse[]> => {
        const playerTeams = await this.playerTeamRepository.findAll();

        return PlayerTeamMapper.toResponseList(playerTeams);
    }

    public findAllIncludingInactive = async (): Promise<PlayerTeamResponse[]> => {
        const playerTeams = await this.playerTeamRepository.findAllIncludingInactive();

        return PlayerTeamMapper.toResponseList(playerTeams);
    }

    public findById = async (id: number): Promise<PlayerTeamResponse> => {
        const playerTeam = await this.findPlayerTeamOrThrow(id);

        return PlayerTeamMapper.toResponse(playerTeam);
    }

    public findByIdIncludingInactive = async (id: number): Promise<PlayerTeamResponse> => {
        const playerTeam = await this.findPlayerTeamIncludingInactiveOrThrow(id);

        return PlayerTeamMapper.toResponse(playerTeam);
    }

    public findByPlayerId = async (playerId: number): Promise<PlayerTeamResponse[]> => {
        const playerTeams = await this.playerTeamRepository.findByPlayerId(playerId);
        
        return PlayerTeamMapper.toResponseList(playerTeams);
    }

    public save = async (createPlayerTeamRequest: CreatePlayerTeamRequest): Promise<PlayerTeamResponse> => {
        const validatedRequest = validateRequest(createPlayerTeamSchema, createPlayerTeamRequest);
        this.validateDates(validatedRequest.entryDate, validatedRequest.exitDate);
        
        const player = await this.findPlayerOrThrow(validatedRequest.playerId);
        const team = await this.findTeamOrThrow(validatedRequest.teamId);
        await this.validateDuplicate(validatedRequest.playerId, validatedRequest.teamId);
        
        const playerTeam = PlayerTeamMapper.toEntity(validatedRequest, player, team);
        const savedPlayerTeam = await this.playerTeamRepository.save(playerTeam);
        if (!savedPlayerTeam) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ PLAYER_TEAM_SAVE_ERROR }`);

        const credentialId = await this.findCredentialIdOrThrow(validatedRequest.playerId);
        await this.credentialRepository.updateOnboardingStatus(credentialId, OnboardingStatus.ACTIVE);

        return PlayerTeamMapper.toResponse(savedPlayerTeam);
    }

    public update = async (updatePlayerTeamRequest: UpdatePlayerTeamRequest): Promise<PlayerTeamResponse> => {
        const playerTeam = await this.findPlayerTeamOrThrow(updatePlayerTeamRequest.id);
        const validatedRequest = validateRequest(updatePlayerTeamSchema, updatePlayerTeamRequest);
        
        const entryDate = validatedRequest.entryDate || playerTeam.entryDate;
        const exitDate = validatedRequest.exitDate === undefined ? playerTeam.exitDate : validatedRequest.exitDate;
        this.validateDates(entryDate, exitDate);
        
        const player = await this.getUpdatedPlayer(validatedRequest.playerId, playerTeam.player);
        const team = await this.getUpdatedTeam(validatedRequest.teamId, playerTeam.team);
        if ((validatedRequest.playerId && validatedRequest.playerId !== playerTeam.player.id) || (validatedRequest.teamId && validatedRequest.teamId !== playerTeam.team.id)) 
        await this.validateDuplicate(validatedRequest.playerId || playerTeam.player.id, validatedRequest.teamId || playerTeam.team.id, playerTeam.id);

        const playerTeamEntity = PlayerTeamMapper.toUpdateEntity(validatedRequest, player, team);
        const updatedPlayerTeam = await this.playerTeamRepository.update(playerTeamEntity);
        if (!updatedPlayerTeam) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ PLAYER_TEAM_UPDATE_ERROR }`);
        
        return PlayerTeamMapper.toResponse(updatedPlayerTeam);
    }

    public delete = async (id: number): Promise<void> => {
        const playerTeam = await this.findPlayerTeamIncludingInactiveOrThrow(id);

        await this.playerTeamRepository.delete(id);

        await this.recomputePlayerOnboardingStatus(playerTeam.player.id);
    }

    public updateStatus = async (id: number, updateStatusRequest: UpdateStatusRequest): Promise<PlayerTeamResponse> => {
        const playerTeam = await this.findPlayerTeamIncludingInactiveOrThrow(id);
        const validatedRequest = validateRequest(updateStatusSchema, updateStatusRequest);

        playerTeam.status = validatedRequest.status;
        const updatedPlayerTeam = await this.playerTeamRepository.update(playerTeam);
        if (!updatedPlayerTeam) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ PLAYER_TEAM_UPDATE_ERROR }`);

        await this.recomputePlayerOnboardingStatus(playerTeam.player.id);

        return PlayerTeamMapper.toResponse(updatedPlayerTeam);
    }

    private findPlayerTeamOrThrow = async (id: number): Promise<PlayerTeam> => {
        const playerTeam = await this.playerTeamRepository.findById(id);
        
        if (!playerTeam) throw new NotFoundException(`${ PLAYER_TEAM_NOT_FOUND }${ id }`);
        
        return playerTeam;
    }

    private findPlayerTeamIncludingInactiveOrThrow = async (id: number): Promise<PlayerTeam> => {
        const playerTeam = await this.playerTeamRepository.findByIdIncludingInactive(id);

        if (!playerTeam) throw new NotFoundException(`${ PLAYER_TEAM_NOT_FOUND }${ id }`);

        return playerTeam;
    }

    private findPlayerOrThrow = async (id: number): Promise<Player> => {
        const player = await this.playerRepository.findById(id);
        
        if (!player) throw new NotFoundException(`${ PLAYER_NOT_FOUND }${ id }`);
        
        return player;
    }

    private findTeamOrThrow = async (id: number): Promise<Team> => {
        const team = await this.teamRepository.findById(id);
        
        if (!team) throw new NotFoundException(`${ TEAM_NOT_FOUND }${ id }`);
        
        return team;
    }

    private findCredentialIdOrThrow = async (playerId: number): Promise<number> => {
        const credentialId = await this.playerRepository.findCredentialIdByPlayerId(playerId);
        if (!credentialId) throw new NotFoundException(`${ CREDENTIAL_NOT_FOUND } for Player ID: ${ playerId }`);

        return credentialId;
    }

    private getUpdatedPlayer = async (newPlayerId: number | undefined, currentPlayer: Player): Promise<Player> => {
        if (!newPlayerId) return currentPlayer;
        
        const player = await this.playerRepository.findById(newPlayerId);
        if (!player) throw new NotFoundException(`${ PLAYER_NOT_FOUND }${ newPlayerId }`);

        return player;
    }

    private getUpdatedTeam = async (newTeamId: number | undefined, currentTeam: Team): Promise<Team> => {
        if (!newTeamId) return currentTeam;
        
        const team = await this.teamRepository.findById(newTeamId);
        if (!team) throw new NotFoundException(`${ TEAM_NOT_FOUND }${ newTeamId }`);

        return team;
    }

    private validateDuplicate = async (playerId: number, teamId: number, excludeId?: number): Promise<void> => {
        const isDuplicate = await this.playerTeamRepository.isDuplicate(playerId, teamId, excludeId);
        if (isDuplicate) throw new ConflictException(`${ PLAYER_TEAM_ALREADY_ASSOCIATED }`);
    }

    private validateDates = (entryDate: Date, exitDate: Date | undefined): void => {
        const now = new Date();
        
        if (entryDate > now) throw new BadRequestException(PLAYER_TEAM_ENTRY_DATE_FUTURE_ERROR);
        if (exitDate && exitDate > now) throw new BadRequestException(PLAYER_TEAM_EXIT_DATE_FUTURE_ERROR);
        if (exitDate !== null && exitDate !== undefined && exitDate <= entryDate) throw new BadRequestException(PLAYER_TEAM_EXIT_DATE_BEFORE_ENTRY_ERROR);
    }

    private recomputePlayerOnboardingStatus = async (playerId: number): Promise<void> => {
        const credentialId = await this.findCredentialIdOrThrow(playerId);

        const stillHasActiveTeam = await this.playerTeamRepository.existsActiveTeamForPlayer(playerId);
        if (stillHasActiveTeam) {
            await this.credentialRepository.updateOnboardingStatus(credentialId, OnboardingStatus.ACTIVE);
            return;
        }

        const hasPendingRequests = await this.joinRequestRepository.existsPendingByPlayer(playerId);
        const newStatus = hasPendingRequests ? OnboardingStatus.TEAM_PENDING : OnboardingStatus.PROFILE_CREATED;

        await this.credentialRepository.updateOnboardingStatus(credentialId, newStatus);
    }
}