export interface CreateTrainingPlanRequest {
    title: string;
    description: string;
    difficulty?: string;
    durationMinutes?: number;
    focusArea?: string;
    clusterId?: number;
}