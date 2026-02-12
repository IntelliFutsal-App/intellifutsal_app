import { TeamResponse, CreateTeamRequest, UpdateTeamRequest, UpdateStatusRequest } from "../interfaces";


export interface ITeamService {
    findAll(): Promise<TeamResponse[]>;
    findAllIncludingInactive(): Promise<TeamResponse[]>;
    findById(id: number): Promise<TeamResponse>;
    findByIdIncludingInactive(id: number): Promise<TeamResponse>;
    findMyTeams(credentialId: number): Promise<TeamResponse[]>;
    save(createTeamRequest: CreateTeamRequest): Promise<TeamResponse>;
    update(updateTeamRequest: UpdateTeamRequest): Promise<TeamResponse>;
    delete(id: number): Promise<void>;
    updateStatus(id: number, updateStatusRequest: UpdateStatusRequest): Promise<TeamResponse>;
}