import { CreateTrainingAssignmentRequest, TrainingAssignmentResponse } from "../interfaces";


export interface ITrainingAssignmentService {
    findByPlayer(credentialId: number): Promise<TrainingAssignmentResponse[]>;
    findByTeam(teamId: number): Promise<TrainingAssignmentResponse[]>;
    findById(id: number): Promise<TrainingAssignmentResponse>;
    create(credentialId: number, request: CreateTrainingAssignmentRequest): Promise<TrainingAssignmentResponse>;
    activate(id: number): Promise<TrainingAssignmentResponse>;
    cancel(id: number): Promise<TrainingAssignmentResponse>;
}