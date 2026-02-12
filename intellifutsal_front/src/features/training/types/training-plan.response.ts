export interface TrainingPlanResponse {
    id: number;
    title: string;
    description: string;
    createdByCoachId?: number | null;
    generatedByAi: boolean;
    difficulty?: string | null;
    durationMinutes?: number | null;
    focusArea?: string | null;
    clusterId?: number | null;
    status: string;
    approvalComment?: string | null;
    createdAt: Date;
    updatedAt?: Date | null;
    approvedAt?: Date | null;
    rejectedAt?: Date | null;
}