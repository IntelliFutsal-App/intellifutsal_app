export interface CreateTrainingAssignmentRequest {
    trainingPlanId: number;
    playerId?: number;
    teamId?: number;
    startDate?: Date;
    endDate?: Date;
}