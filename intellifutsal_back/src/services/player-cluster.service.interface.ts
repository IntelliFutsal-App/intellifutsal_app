import { PlayerClusterResponse, CreatePlayerClusterRequest, UpdatePlayerClusterRequest } from "../interfaces";


export interface IPlayerClusterService {
    findAll(): Promise<PlayerClusterResponse[]>;
    findById(id: number): Promise<PlayerClusterResponse>;
    save(createPlayerClusterRequest: CreatePlayerClusterRequest): Promise<PlayerClusterResponse>;
    update(updatePlayerClusterRequest: UpdatePlayerClusterRequest): Promise<PlayerClusterResponse>;
    delete(id: number): Promise<void>;
}