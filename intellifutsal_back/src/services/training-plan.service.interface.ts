import { CreateTrainingPlanRequest, TrainingPlanResponse, UpdateTrainingPlanStatusRequest } from "../interfaces";


export interface ITrainingPlanService {
    findAll(): Promise<TrainingPlanResponse[]>;
    findById(id: number): Promise<TrainingPlanResponse>;
    createManual(credentialId: number, createRequest: CreateTrainingPlanRequest): Promise<TrainingPlanResponse>;
    createFromAiForPlayer(playerId: number, credentialId: number): Promise<TrainingPlanResponse>;
    createFromAiForTeam(teamId: number, credentialId: number): Promise<TrainingPlanResponse>;
    approve(id: number, updateRequest: UpdateTrainingPlanStatusRequest): Promise<TrainingPlanResponse>;
    reject(id: number, updateRequest: UpdateTrainingPlanStatusRequest): Promise<TrainingPlanResponse>;
    archive(id: number): Promise<TrainingPlanResponse>;
}