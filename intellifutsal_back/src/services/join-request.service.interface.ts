import { CreateJoinRequestRequest, JoinRequestResponse, UpdateJoinRequestStatusRequest } from "../interfaces";


export interface IJoinRequestService {
    findAll(): Promise<JoinRequestResponse[]>;
    findById(id: number): Promise<JoinRequestResponse>;
    findByPlayer(credentialId: number): Promise<JoinRequestResponse[]>;
    findPendingByTeam(teamId: number): Promise<JoinRequestResponse[]>;
    create(credentialId: number, createJoinRequestRequest: CreateJoinRequestRequest): Promise<JoinRequestResponse>;
    approve(id: number, credentialId: number): Promise<JoinRequestResponse>;
    reject(id: number, credentialId: number, updateStatusRequest: UpdateJoinRequestStatusRequest): Promise<JoinRequestResponse>;
    delete(id: number, credentialId: number): Promise<void>;
}