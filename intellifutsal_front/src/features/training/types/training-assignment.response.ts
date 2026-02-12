export interface TrainingAssignmentResponse {
    id: number;
    trainingPlanId: number;
    playerId?: number | null;
    teamId?: number | null;
    assignedByCoachId?: number | null;
    status: string;
    startDate?: Date | null;
    endDate?: Date | null;
    approvedAt?: Date | null;
    cancelledAt?: Date | null;
    createdAt: Date;
    updatedAt?: Date | null;
}