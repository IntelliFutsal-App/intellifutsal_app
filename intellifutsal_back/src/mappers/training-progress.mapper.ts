import { TrainingProgressResponse, CreateTrainingProgressRequest } from "../interfaces";
import { TrainingProgress, TrainingAssignment, Player, Coach } from "../models";


export class TrainingProgressMapper {
    static toResponse = (trainingProgress: TrainingProgress): TrainingProgressResponse => {
        const trainingProgressResponse = new TrainingProgressResponse();

        trainingProgressResponse.id = trainingProgress.id;
        trainingProgressResponse.trainingAssignmentId = trainingProgress.trainingAssignment.id;
        trainingProgressResponse.recordedByPlayerId = trainingProgress.recordedByPlayer?.id;
        trainingProgressResponse.recordedByCoachId = trainingProgress.recordedByCoach?.id;
        trainingProgressResponse.progressDate = trainingProgress.progressDate;
        trainingProgressResponse.completionPercentage = trainingProgress.completionPercentage;
        trainingProgressResponse.notes = trainingProgress.notes;
        trainingProgressResponse.coachVerified = trainingProgress.coachVerified;
        trainingProgressResponse.verifiedAt = trainingProgress.verifiedAt;
        trainingProgressResponse.verificationComment = trainingProgress.verificationComment;
        trainingProgressResponse.createdAt = trainingProgress.createdAt;
        if (trainingProgress.updatedAt) trainingProgressResponse.updatedAt = trainingProgress.updatedAt;

        return trainingProgressResponse;
    };

    static toResponseList = (trainingProgresses: TrainingProgress[]): TrainingProgressResponse[] => {
        return trainingProgresses.map(this.toResponse);
    };

    static toEntityByPlayer = (createTrainingProgressRequest: CreateTrainingProgressRequest, trainingAssignment: TrainingAssignment, player: Player): TrainingProgress => {
        const trainingProgress = new TrainingProgress();

        trainingProgress.trainingAssignment = trainingAssignment;
        trainingProgress.recordedByPlayer = player;
        trainingProgress.progressDate = createTrainingProgressRequest.progressDate;
        trainingProgress.completionPercentage = createTrainingProgressRequest.completionPercentage;
        trainingProgress.notes = createTrainingProgressRequest.notes;
        trainingProgress.coachVerified = false;

        return trainingProgress;
    };

    static toEntityByCoach = (createTrainingProgressRequest: CreateTrainingProgressRequest, trainingAssignment: TrainingAssignment, coach: Coach): TrainingProgress => {
        const trainingProgress = new TrainingProgress();

        trainingProgress.trainingAssignment = trainingAssignment;
        trainingProgress.recordedByCoach = coach;
        trainingProgress.progressDate = createTrainingProgressRequest.progressDate;
        trainingProgress.completionPercentage = createTrainingProgressRequest.completionPercentage;
        trainingProgress.notes = createTrainingProgressRequest.notes;
        trainingProgress.coachVerified = true;
        trainingProgress.verifiedAt = new Date();

        return trainingProgress;
    };
}