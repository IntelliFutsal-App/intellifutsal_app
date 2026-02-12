import { createPlayerSchema, updatePlayerSchema, updateStatusSchema } from "../../dto";
import { ConflictException, InternalServerException, NotFoundException } from "../../exceptions";
import { CreatePlayerRequest, OnboardingStatus, PlayerResponse, Role, UpdatePlayerRequest, UpdateStatusRequest } from "../../interfaces";
import { PlayerMapper } from "../../mappers";
import { Credential, Player } from "../../models";
import { CoachRepository, CredentialRepository, PlayerRepository } from "../../repository";
import { LOGIN_URL } from "../../utilities/constants.utility";
import { CREDENTIAL_ALREADY_ASSIGNED_COACH, CREDENTIAL_ALREADY_ASSIGNED_PLAYER, CREDENTIAL_NOT_FOUND, INTERNAL_SERVER_ERROR, PLAYER_NOT_FOUND, PLAYER_ROLE_NOT_VALID, PLAYER_SAVE_ERROR, PLAYER_UPDATE_ERROR, PLAYERS_NOT_FOUND_TEAM } from "../../utilities/messages.utility";
import { validateRequest } from "../../utilities/validations.utility";
import { IPlayerService } from "../player.service.interface";
import { MailService } from "./mail.service";


export class PlayerService implements IPlayerService {
    private readonly playerRepository: PlayerRepository;
    private readonly credentialRepository: CredentialRepository;
    private readonly coachRepository: CoachRepository;
    private readonly mailService: MailService;

    constructor() {
        this.playerRepository = new PlayerRepository();
        this.credentialRepository = new CredentialRepository();
        this.coachRepository = new CoachRepository();
        this.mailService = new MailService();
    }

    public findAll = async (): Promise<PlayerResponse[]> => {
        const players = await this.playerRepository.findAll();

        return PlayerMapper.toResponseList(players);
    }

    public findAllIncludingInactive = async (): Promise<PlayerResponse[]> => {
        const players = await this.playerRepository.findAllIncludingInactive();

        return PlayerMapper.toResponseList(players);
    }

    public findById = async (id: number): Promise<PlayerResponse> => {
        const player = await this.findPlayerOrThrow(id);
        
        return PlayerMapper.toResponse(player);
    }

    public findByIdIncludingInactive = async (id: number): Promise<PlayerResponse> => {
        const player = await this.findPlayerIncludingInactiveOrThrow(id);

        return PlayerMapper.toResponse(player);
    }

    public findByTeamId = async (teamId: number): Promise<PlayerResponse[]> => {
        const players = await this.findPlayersByTeamIdOrThrow(teamId);

        return PlayerMapper.toResponseList(players);
    }

    public save = async (credentialId: number, createPlayerRequest: CreatePlayerRequest): Promise<PlayerResponse> => {
        const validatedRequest = validateRequest(createPlayerSchema, createPlayerRequest);
        const credential = await this.findCredentialOrThrow(credentialId);
        
        const bmi = this.calculateBmi(validatedRequest.weight, validatedRequest.height);
        const player = PlayerMapper.toEntity(validatedRequest, credential, bmi);
        const savedPlayer = await this.playerRepository.save(player);
        if (!savedPlayer) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ PLAYER_SAVE_ERROR }`);

        await this.credentialRepository.updateOnboardingStatus(credential.id, OnboardingStatus.PROFILE_CREATED);
        
        this.sendWelcomeMailAsync(savedPlayer, credential);

        return PlayerMapper.toResponse(savedPlayer);
    }

    public update = async (updatePlayerRequest: UpdatePlayerRequest): Promise<PlayerResponse> => {
        const player = await this.findPlayerOrThrow(updatePlayerRequest.id);
        const validatedRequest = validateRequest(updatePlayerSchema, updatePlayerRequest);
        
        const bmi = this.updateBmi(validatedRequest, player);
        const playerEntity = PlayerMapper.toUpdateEntity(validatedRequest, bmi);
        const updatedPlayer = await this.playerRepository.update(playerEntity);
        if (!updatedPlayer) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ PLAYER_UPDATE_ERROR }`);
        
        return PlayerMapper.toResponse(updatedPlayer);
    }

    public delete = async (id: number): Promise<void> => {
        await this.findPlayerOrThrow(id);
        await this.playerRepository.delete(id);
    }

    public updateStatus = async (id: number, updateStatusRequest: UpdateStatusRequest): Promise<PlayerResponse> => {
        const player = await this.findPlayerIncludingInactiveOrThrow(id);
        const validatedRequest = validateRequest(updateStatusSchema, updateStatusRequest);

        player.status = validatedRequest.status;
        const updatedPlayer = await this.playerRepository.update(player);
        if (!updatedPlayer) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ PLAYER_UPDATE_ERROR }`);

        return PlayerMapper.toResponse(updatedPlayer);
    }

    private findPlayerOrThrow = async (id: number): Promise<Player> => {
        const player = await this.playerRepository.findById(id);
        
        if (!player) throw new NotFoundException(`${ PLAYER_NOT_FOUND }${ id }`);
        
        return player;
    }

    private findPlayerIncludingInactiveOrThrow = async (id: number): Promise<Player> => {
        const player = await this.playerRepository.findByIdIncludingInactive(id);

        if (!player) throw new NotFoundException(`${ PLAYER_NOT_FOUND }${ id }`);

        return player;
    }

    private findPlayersByTeamIdOrThrow = async (teamId: number): Promise<Player[]> => {
        const players = await this.playerRepository.findByTeamId(teamId);

        if (!players || players.length === 0) throw new NotFoundException(`${ PLAYERS_NOT_FOUND_TEAM }${ teamId }`);

        return players;
    }

    private findCredentialOrThrow = async (id: number): Promise<Credential> => {
        const credential = await this.credentialRepository.findById(id);
        if (!credential) throw new NotFoundException(`${ CREDENTIAL_NOT_FOUND }${ id }`);
        if (credential.role !== Role.PLAYER) throw new ConflictException(`${ PLAYER_ROLE_NOT_VALID }`);
        
        const isAlreadyAssignedToPlayer = await this.playerRepository.isAssignedToPlayer(id);
        if (isAlreadyAssignedToPlayer) throw new ConflictException(CREDENTIAL_ALREADY_ASSIGNED_PLAYER);
        
        const isAlreadyAssignedToCoach = await this.coachRepository.isAssignedToCoach(id);
        if (isAlreadyAssignedToCoach) throw new ConflictException(CREDENTIAL_ALREADY_ASSIGNED_COACH);

        return credential;
    }

    private updateBmi = (validatedRequest: UpdatePlayerRequest, player: Player): number => {
        const finalWeight = validatedRequest.weight !== undefined ? validatedRequest.weight : player.weight;
        const finalHeight = validatedRequest.height !== undefined ? validatedRequest.height : player.height;

        return this.calculateBmi(finalWeight, finalHeight);
    }

    private calculateBmi = (weight: number, height: number): number => {
        return Number((weight / (height ** 2)).toFixed(2));
    };

    private sendWelcomeMailAsync = (player: Player, credential: Credential): void => {
        this.mailService.sendMailAsync(
            [credential.email], 
            "welcome", 
            {
                name: `${ player.firstName } ${ player.lastName }`,
                email: credential.email,
                registrationDate: credential.createdAt,
                loginUrl: LOGIN_URL,
            }
        );
    }
}
