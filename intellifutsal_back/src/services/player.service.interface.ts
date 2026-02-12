import { PlayerResponse, CreatePlayerRequest, UpdatePlayerRequest, UpdateStatusRequest } from "../interfaces";


export interface IPlayerService {
    findAll(): Promise<PlayerResponse[]>;
    findAllIncludingInactive(): Promise<PlayerResponse[]>;
    findById(id: number): Promise<PlayerResponse>;
    findByIdIncludingInactive(id: number): Promise<PlayerResponse>;
    findByTeamId(teamId: number): Promise<PlayerResponse[]>;
    save(credentialId: number, createPlayerRequest: CreatePlayerRequest): Promise<PlayerResponse>;
    update(updatePlayerRequest: UpdatePlayerRequest): Promise<PlayerResponse>;
    delete(id: number): Promise<void>;
    updateStatus(id: number, updateStatusRequest: UpdateStatusRequest): Promise<PlayerResponse>;
}