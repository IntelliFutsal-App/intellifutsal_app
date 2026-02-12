export interface PlayerClusterResponse {
    id: number;
    playerId: number;
    clusterId: number;
    createdAt: Date;
    updatedAt?: Date | null;
}