import { createJoinRequestSchema, updateJoinRequestStatusSchema } from "../../dto";
import { BadRequestException, ConflictException, InternalServerException, NotFoundException, UnauthorizedException } from "../../exceptions";
import { CreateJoinRequestRequest, JoinRequestResponse, UpdateJoinRequestStatusRequest, JoinRequestStatus, OnboardingStatus } from "../../interfaces";
import { JoinRequestMapper, PlayerTeamMapper } from "../../mappers";
import { Credential, JoinRequest, Player, Team } from "../../models";
import { JoinRequestRepository, PlayerRepository, TeamRepository, PlayerTeamRepository, CoachTeamRepository, CoachRepository, CredentialRepository } from "../../repository";
import { COACH_NOT_ASSIGNED_TO_TEAM, COACH_NOT_FOUND_CREDENTIAL, CREDENTIAL_NOT_FOUND, INTERNAL_SERVER_ERROR, JOIN_REQUEST_ALREADY_EXISTS, JOIN_REQUEST_CREATION_NOT_ALLOWED_FOR_ANOTHER_PLAYER, JOIN_REQUEST_NOT_FOUND, JOIN_REQUEST_NOT_PENDING, JOIN_REQUEST_SAVE_ERROR, JOIN_REQUEST_UPDATE_ERROR, PLAYER_ALREADY_IN_TEAM, PLAYER_NOT_FOUND, PLAYER_NOT_FOUND_CREDENTIAL, TEAM_NOT_FOUND } from "../../utilities/messages.utility";
import { validateRequest } from "../../utilities/validations.utility";
import { IJoinRequestService } from "../join-request.service.interface";


export class JoinRequestService implements IJoinRequestService {
    private readonly joinRequestRepository: JoinRequestRepository;
    private readonly credentialRepository: CredentialRepository;
    private readonly playerRepository: PlayerRepository;
    private readonly coachRepository: CoachRepository;
    private readonly teamRepository: TeamRepository;
    private readonly playerTeamRepository: PlayerTeamRepository;
    private readonly coachTeamRepository: CoachTeamRepository;

    constructor() {
        this.joinRequestRepository = new JoinRequestRepository();
        this.credentialRepository = new CredentialRepository();
        this.playerRepository = new PlayerRepository();
        this.coachRepository = new CoachRepository();
        this.teamRepository = new TeamRepository();
        this.playerTeamRepository = new PlayerTeamRepository();
        this.coachTeamRepository = new CoachTeamRepository();
    }

    public findAll = async (): Promise<JoinRequestResponse[]> => {
        const requests = await this.joinRequestRepository.findAll();

        return JoinRequestMapper.toResponseList(requests);
    };

    public findById = async (id: number): Promise<JoinRequestResponse> => {
        const request = await this.findJoinRequestOrThrow(id);

        return JoinRequestMapper.toResponse(request);
    };

    public findByPlayer = async (credentialId: number): Promise<JoinRequestResponse[]> => {
        const player = await this.playerRepository.findByCredentialId(credentialId);
        if (!player) throw new NotFoundException(`${ PLAYER_NOT_FOUND_CREDENTIAL }${ credentialId }`);

        const requests = await this.joinRequestRepository.findPendingByPlayer(player.id);

        return JoinRequestMapper.toResponseList(requests);
    };

    public findPendingByTeam = async (teamId: number): Promise<JoinRequestResponse[]> => {
        const requests = await this.joinRequestRepository.findPendingByTeam(teamId);

        return JoinRequestMapper.toResponseList(requests);
    };

    public create = async (credentialId: number, createJoinRequestRequest: CreateJoinRequestRequest,): Promise<JoinRequestResponse> => {
        const credential = await this.findCredentialOrThrow(credentialId);
        const validatedRequest = validateRequest(createJoinRequestSchema, createJoinRequestRequest);

        const player = await this.findPlayerByCredentialOrThrow(credentialId);
        const team = await this.findTeamOrThrow(validatedRequest.teamId);

        await this.ensurePlayerNotAlreadyInTeam(player.id, team.id);
        await this.ensureNoPendingRequest(player.id, team.id);

        const joinRequestEntity = JoinRequestMapper.toEntityCreate(player, team);
        const savedRequest = await this.joinRequestRepository.save(joinRequestEntity);
        if (!savedRequest) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ JOIN_REQUEST_SAVE_ERROR }`);

        await this.credentialRepository.updateOnboardingStatus(credential.id, OnboardingStatus.TEAM_PENDING);

        return JoinRequestMapper.toResponse(savedRequest);
    };

    public approve = async (id: number, credentialId: number): Promise<JoinRequestResponse> => {
        const request = await this.findJoinRequestOrThrow(id);

        await this.ensureCoachBelongsToTeam(credentialId, request.team.id);
        if (request.status !== JoinRequestStatus.PENDING) throw new BadRequestException(`${ JOIN_REQUEST_NOT_PENDING }${ request.status }`);

        await this.ensurePlayerNotAlreadyInTeam(request.player.id, request.team.id);
        const updatedRequest = await this.joinRequestRepository.updateStatus(request.id, JoinRequestStatus.APPROVED, request.reviewComment,);

        const playerTeam = PlayerTeamMapper.toEntity(
            {
                playerId: request.player.id,
                teamId: request.team.id,
                entryDate: new Date(),
                exitDate: undefined,
            },
            request.player,
            request.team,
        );

        const savedPlayerTeam = await this.playerTeamRepository.save(playerTeam);
        if (!savedPlayerTeam) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ JOIN_REQUEST_UPDATE_ERROR }`);

        return JoinRequestMapper.toResponse(updatedRequest!);
    };

    public reject = async (id: number, credentialId: number, updateStatusRequest: UpdateJoinRequestStatusRequest): Promise<JoinRequestResponse> => {
        const request = await this.findJoinRequestOrThrow(id);

        await this.ensureCoachBelongsToTeam(credentialId, request.team.id);
        const validatedRequest = validateRequest(updateJoinRequestStatusSchema, updateStatusRequest);

        if (request.status !== JoinRequestStatus.PENDING) throw new BadRequestException(`${ JOIN_REQUEST_NOT_PENDING }${ request.status }`);

        const updatedRequest = await this.joinRequestRepository.updateStatus(request.id, JoinRequestStatus.REJECTED, validatedRequest.reviewComment);
        if (!updatedRequest) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ JOIN_REQUEST_UPDATE_ERROR }`);

        return JoinRequestMapper.toResponse(updatedRequest);
    };

    public cancel = async (id: number, credentialId: number): Promise<JoinRequestResponse> => {
        const request = await this.findJoinRequestOrThrow(id);
        const player = await this.findPlayerByCredentialOrThrow(credentialId);

        if (request.player.id !== player.id) throw new UnauthorizedException(JOIN_REQUEST_CREATION_NOT_ALLOWED_FOR_ANOTHER_PLAYER);
        if (request.status !== JoinRequestStatus.PENDING) throw new BadRequestException(`${ JOIN_REQUEST_NOT_PENDING }${ request.status }`);

        const updatedRequest = await this.joinRequestRepository.updateStatus(request.id, JoinRequestStatus.CANCELLED,);
        if (!updatedRequest) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ JOIN_REQUEST_UPDATE_ERROR }`);

        return JoinRequestMapper.toResponse(updatedRequest);
    };

    public delete = async (id: number): Promise<void> => {
        await this.findJoinRequestOrThrow(id);
        await this.joinRequestRepository.delete(id);
    };

    private findJoinRequestOrThrow = async (id: number): Promise<JoinRequest> => {
        const request = await this.joinRequestRepository.findById(id);
        if (!request) throw new NotFoundException(`${ JOIN_REQUEST_NOT_FOUND }${ id }`);

        return request;
    };

    private findPlayerByCredentialOrThrow = async (credentialId: number): Promise<Player> => {
        const player = await this.playerRepository.findByCredentialId(credentialId);
        if (!player) throw new NotFoundException(`${ PLAYER_NOT_FOUND_CREDENTIAL }${ credentialId }`);

        return player;
    };

    private findCredentialOrThrow = async (id: number): Promise<Credential> => {
        const credential = await this.credentialRepository.findById(id);
        if (!credential) throw new NotFoundException(`${ CREDENTIAL_NOT_FOUND }${ id }`);
        
        return credential;
    };

    private findTeamOrThrow = async (id: number): Promise<Team> => {
        const team = await this.teamRepository.findById(id);
        if (!team) throw new NotFoundException(`${ TEAM_NOT_FOUND }${ id }`);

        return team;
    };

    private ensureNoPendingRequest = async (playerId: number, teamId: number): Promise<void> => {
        const existing = await this.joinRequestRepository.findByPlayerAndTeam(playerId, teamId);

        if (existing && existing.status === JoinRequestStatus.PENDING) throw new ConflictException(JOIN_REQUEST_ALREADY_EXISTS);
    };

    private ensurePlayerNotAlreadyInTeam = async (playerId: number, teamId: number): Promise<void> => {
        const existingPlayerTeams = await this.playerTeamRepository.findByPlayerId(playerId);
        const alreadyInTeam = existingPlayerTeams.some(
            (pt) => pt.team.id === teamId && pt.status === true && !pt.exitDate,
        );

        if (alreadyInTeam) throw new ConflictException(PLAYER_ALREADY_IN_TEAM);
    };

    private ensureCoachBelongsToTeam = async (credentialId: number, teamId: number): Promise<void> => {
        const coach = await this.coachRepository.findByCredentialId(credentialId);
        if (!coach) throw new NotFoundException(`${ COACH_NOT_FOUND_CREDENTIAL }${ credentialId }`);

        const assignment = await this.coachTeamRepository.findActiveByCoachAndTeam(coach.id, teamId);
        if (!assignment) throw new UnauthorizedException(COACH_NOT_ASSIGNED_TO_TEAM);
    };
}