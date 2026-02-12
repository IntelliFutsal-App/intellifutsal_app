import { PlayerTeamResponse, CreatePlayerTeamRequest, UpdatePlayerTeamRequest, UpdateStatusRequest } from "../interfaces";


export interface IPlayerTeamService {
    findAll(): Promise<PlayerTeamResponse[]>;
    findAllIncludingInactive(): Promise<PlayerTeamResponse[]>;
    findById(id: number): Promise<PlayerTeamResponse>;
    findByIdIncludingInactive(id: number): Promise<PlayerTeamResponse>;
    findByPlayerId(playerId: number): Promise<PlayerTeamResponse[]>;
    save(createPlayerTeamRequest: CreatePlayerTeamRequest): Promise<PlayerTeamResponse>;
    update(updatePlayerTeamRequest: UpdatePlayerTeamRequest): Promise<PlayerTeamResponse>;
    delete(id: number): Promise<void>;
    updateStatus(id: number, updateStatusRequest: UpdateStatusRequest): Promise<PlayerTeamResponse>;
}