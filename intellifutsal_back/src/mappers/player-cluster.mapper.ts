import { PlayerClusterResponse, UpdatePlayerClusterRequest } from "../interfaces";
import { Player, PlayerCluster, Cluster } from "../models";


export class PlayerClusterMapper {
    static toResponse = (playerCluster: PlayerCluster): PlayerClusterResponse => {
        const playerClusterResponse = new PlayerClusterResponse();

        playerClusterResponse.id = playerCluster.id;
        playerClusterResponse.playerId = playerCluster.player.id;
        playerClusterResponse.clusterId = playerCluster.cluster.id;
        playerClusterResponse.createdAt = playerCluster.createdAt;
        if (playerCluster.updatedAt) playerClusterResponse.updatedAt = playerCluster.updatedAt;

        return playerClusterResponse;
    }

    static toResponseList = (playerClusters: PlayerCluster[]): PlayerClusterResponse[] => {
        return playerClusters.map(this.toResponse);
    }

    static toEntity = (player: Player, cluster: Cluster): PlayerCluster => {
        const playerCluster = new PlayerCluster();

        playerCluster.player = player;
        playerCluster.cluster = cluster;

        return playerCluster;
    }

    static toUpdateEntity = (updatePlayerClusterRequest: UpdatePlayerClusterRequest, player?: Player, cluster?: Cluster): PlayerCluster => {
        const playerCluster = new PlayerCluster();

        playerCluster.id = updatePlayerClusterRequest.id;
        
        if (player) playerCluster.player = player;
        if (cluster) playerCluster.cluster = cluster;

        return playerCluster;
    }
}