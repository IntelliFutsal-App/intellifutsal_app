export class CreateTrainingProgressRequest {
    trainingAssignmentId!: number;
    progressDate!: Date;
    completionPercentage!: number;
    notes?: string;
}