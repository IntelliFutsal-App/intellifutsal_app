import { CreateTrainingProgressRequest, TrainingProgressResponse, VerifyTrainingProgressRequest } from '../../domain/interfaces';


export interface ITrainingProgressService {
    findByAssignment(assignmentId: number): Promise<TrainingProgressResponse[]>;
    createByPlayer(credentialId: number, request: CreateTrainingProgressRequest): Promise<TrainingProgressResponse>;
    verifyByCoach(credentialId: number, progressId: number, request: VerifyTrainingProgressRequest): Promise<TrainingProgressResponse>;
}