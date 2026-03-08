import { CoachResponse, CreateCoachRequest, UpdateCoachRequest, UpdateStatusRequest } from '../../domain/interfaces';


export interface ICoachService {
    findAll(): Promise<CoachResponse[]>;
    findAllIncludingInactive(): Promise<CoachResponse[]>;
    findById(id: number): Promise<CoachResponse>;
    findByIdIncludingInactive(id: number): Promise<CoachResponse>;
    save(credentialId: number, createCoachRequest: CreateCoachRequest): Promise<CoachResponse>;
    update(updateCoachRequest: UpdateCoachRequest): Promise<CoachResponse>;
    delete(id: number): Promise<void>;
    updateStatus(id: number, updateStatusRequest: UpdateStatusRequest): Promise<CoachResponse>;
}