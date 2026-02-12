import { createPlayerClusterSchema, updatePlayerClusterSchema } from "../../dto";
import { ConflictException, InternalServerException, NotFoundException } from "../../exceptions";
import { PlayerClusterResponse, CreatePlayerClusterRequest, UpdatePlayerClusterRequest } from "../../interfaces";
import { PlayerClusterMapper } from "../../mappers";
import { Cluster, Player, PlayerCluster } from "../../models";
import { ClusterRepository, PlayerClusterRepository, PlayerRepository } from "../../repository";
import { CLUSTER_NOT_FOUND, INTERNAL_SERVER_ERROR, PLAYER_CLUSTER_ALREADY_ASSOCIATED, PLAYER_CLUSTER_NOT_FOUND, PLAYER_CLUSTER_SAVE_ERROR, PLAYER_CLUSTER_UPDATE_ERROR, PLAYER_NOT_FOUND } from "../../utilities/messages.utility";
import { validateRequest } from "../../utilities/validations.utility";
import { IPlayerClusterService } from "../player-cluster.service.interface";


export class PlayerClusterService implements IPlayerClusterService {
    private readonly playerClusterRepository: PlayerClusterRepository;
    private readonly playerRepository: PlayerRepository;
    private readonly clusterRepository: ClusterRepository;

    constructor() {
        this.playerClusterRepository = new PlayerClusterRepository();
        this.playerRepository = new PlayerRepository();
        this.clusterRepository = new ClusterRepository();
    }

    public findAll = async (): Promise<PlayerClusterResponse[]> => {
        const playerClusters = await this.playerClusterRepository.findAll();

        return PlayerClusterMapper.toResponseList(playerClusters);
    }
    
    public findById = async (id: number): Promise<PlayerClusterResponse> => {
        const playerCluster = await this.findPlayerClusterOrThrow(id);
        
        return PlayerClusterMapper.toResponse(playerCluster);
    }
    
    public save = async (createPlayerClusterRequest: CreatePlayerClusterRequest): Promise<PlayerClusterResponse> => {
        const validatedRequest = validateRequest(createPlayerClusterSchema, createPlayerClusterRequest);
        
        const player = await this.findPlayerOrThrow(validatedRequest.playerId);
        const cluster = await this.findClusterOrThrow(validatedRequest.clusterId);
        await this.validateDuplicate(validatedRequest.playerId, validatedRequest.clusterId);

        const playerCluster = PlayerClusterMapper.toEntity(player, cluster);
        const savedPlayerCluster = await this.playerClusterRepository.save(playerCluster);
        if (!savedPlayerCluster) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ PLAYER_CLUSTER_SAVE_ERROR }`);
        
        return PlayerClusterMapper.toResponse(savedPlayerCluster);
    }
    
    public update = async (updatePlayerClusterRequest: UpdatePlayerClusterRequest): Promise<PlayerClusterResponse> => {
        const playerCluster = await this.findPlayerClusterOrThrow(updatePlayerClusterRequest.id);
        const validatedRequest = validateRequest(updatePlayerClusterSchema, updatePlayerClusterRequest);
        
        const player = await this.getUpdatedPlayer(validatedRequest.playerId, playerCluster.player);
        const cluster = await this.getUpdatedCluster(validatedRequest.clusterId, playerCluster.cluster);
        if ((validatedRequest.playerId && validatedRequest.playerId !== playerCluster.player.id) || (validatedRequest.clusterId && validatedRequest.clusterId !== playerCluster.cluster.id))
        await this.validateDuplicate(validatedRequest.playerId || playerCluster.player.id, validatedRequest.clusterId || playerCluster.cluster.id, playerCluster.id);

        const playerClusterEntity = PlayerClusterMapper.toUpdateEntity(validatedRequest, player, cluster);
        const updatedPlayerCluster = await this.playerClusterRepository.update(playerClusterEntity);
        if (!updatedPlayerCluster) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ PLAYER_CLUSTER_UPDATE_ERROR }`);
        
        return PlayerClusterMapper.toResponse(updatedPlayerCluster);
    }
    
    public delete = async (id: number): Promise<void> => {
        await this.findPlayerClusterOrThrow(id);
        await this.playerClusterRepository.delete(id);
    }

    private findPlayerClusterOrThrow = async (id: number): Promise<PlayerCluster> => {
        const playerCluster = await this.playerClusterRepository.findById(id);
        
        if (!playerCluster) throw new NotFoundException(`${ PLAYER_CLUSTER_NOT_FOUND }${ id }`);
        
        return playerCluster;
    }

    private findPlayerOrThrow = async (id: number): Promise<Player> => {
        const player = await this.playerRepository.findById(id);
        
        if (!player) throw new NotFoundException(`${ PLAYER_NOT_FOUND }${ id }`);
        
        return player;
    }

    private findClusterOrThrow = async (id: number): Promise<Cluster> => {
        const cluster = await this.clusterRepository.findById(id);
        
        if (!cluster) throw new NotFoundException(`${ CLUSTER_NOT_FOUND }${ id }`);
        
        return cluster;
    }

    private getUpdatedPlayer = async (newPlayerId: number | undefined, currentPlayer: Player): Promise<Player> => {
        if (!newPlayerId) return currentPlayer;
        
        const player = await this.playerRepository.findById(newPlayerId);
        if (!player) throw new NotFoundException(`${ PLAYER_NOT_FOUND }${ newPlayerId }`);

        return player;
    }

    private getUpdatedCluster = async (newClusterId: number | undefined, currentCluster: Cluster): Promise<Cluster> => {
        if (!newClusterId) return currentCluster;
        
        const cluster = await this.clusterRepository.findById(newClusterId);
        if (!cluster) throw new NotFoundException(`${ CLUSTER_NOT_FOUND }${ newClusterId }`);

        return cluster;
    }

    private validateDuplicate = async (playerId: number, clusterId: number, excludeId?: number): Promise<void> => {
        const isDuplicate = await this.playerClusterRepository.isDuplicate(playerId, clusterId, excludeId);
        if (isDuplicate) throw new ConflictException(`${ PLAYER_CLUSTER_ALREADY_ASSOCIATED }`);
    }
}