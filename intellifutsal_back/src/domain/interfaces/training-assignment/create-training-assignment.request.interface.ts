export class CreateTrainingAssignmentRequest {
    trainingPlanId!: number;
    playerId?: number;
    teamId?: number;
    startDate?: Date;
    endDate?: Date;
}