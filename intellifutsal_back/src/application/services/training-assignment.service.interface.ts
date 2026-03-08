import { CreateTrainingAssignmentRequest, TrainingAssignmentResponse } from '../../domain/interfaces';


export interface ITrainingAssignmentService {
    findAll(): Promise<TrainingAssignmentResponse[]>;
    findByPlayer(credentialId: number): Promise<TrainingAssignmentResponse[]>;
    findByTeam(teamId: number): Promise<TrainingAssignmentResponse[]>;
    findById(id: number): Promise<TrainingAssignmentResponse>;
    create(credentialId: number, request: CreateTrainingAssignmentRequest): Promise<TrainingAssignmentResponse>;
    activate(id: number): Promise<TrainingAssignmentResponse>;
    cancel(id: number): Promise<TrainingAssignmentResponse>;
}