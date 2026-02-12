export interface TrainingProgressResponse {
    id: number;
    trainingAssignmentId: number;
    recordedByPlayerId?: number | null;
    recordedByCoachId?: number | null;
    progressDate: Date;
    completionPercentage: number;
    notes?: string | null;
    coachVerified: boolean;
    verifiedAt?: Date | null;
    verificationComment?: string | null;
    createdAt: Date;
    updatedAt?: Date | null;
}