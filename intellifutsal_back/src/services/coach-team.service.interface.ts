import { CoachTeamResponse, CreateCoachTeamRequest, UpdateCoachTeamRequest, UpdateStatusRequest } from "../interfaces";


export interface ICoachTeamService {
    findAll(): Promise<CoachTeamResponse[]>;
    findAllIncludingInactive(): Promise<CoachTeamResponse[]>;
    findById(id: number): Promise<CoachTeamResponse>;
    findByIdIncludingInactive(id: number): Promise<CoachTeamResponse>;
    findByCoachId(coachId: number): Promise<CoachTeamResponse[]>;
    save(credentialId: number, createCoachTeamRequest: CreateCoachTeamRequest): Promise<CoachTeamResponse>;
    update(updateCoachTeamRequest: UpdateCoachTeamRequest): Promise<CoachTeamResponse>;
    delete(id: number): Promise<void>;
    updateStatus(id: number, updateStatusRequest: UpdateStatusRequest): Promise<CoachTeamResponse>;
}