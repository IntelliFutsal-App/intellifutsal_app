import { TrainingAssignmentResponse, CreateTrainingAssignmentRequest } from "../interfaces";
import { TrainingAssignment, TrainingPlan, Player, Team, Coach } from "../models";
import { TrainingAssignmentStatus } from "../interfaces/enums";


export class TrainingAssignmentMapper {
    static toResponse = (trainingAssignment: TrainingAssignment): TrainingAssignmentResponse => {
        const trainingAssignmentResponse = new TrainingAssignmentResponse();

        trainingAssignmentResponse.id = trainingAssignment.id;
        trainingAssignmentResponse.trainingPlanId = trainingAssignment.trainingPlan.id;
        trainingAssignmentResponse.playerId = trainingAssignment.player?.id;
        trainingAssignmentResponse.teamId = trainingAssignment.team?.id;
        trainingAssignmentResponse.assignedByCoachId = trainingAssignment.assignedByCoach?.id;
        trainingAssignmentResponse.status = trainingAssignment.status;
        trainingAssignmentResponse.startDate = trainingAssignment.startDate;
        trainingAssignmentResponse.endDate = trainingAssignment.endDate;
        trainingAssignmentResponse.approvedAt = trainingAssignment.approvedAt;
        trainingAssignmentResponse.cancelledAt = trainingAssignment.cancelledAt;
        trainingAssignmentResponse.createdAt = trainingAssignment.createdAt;
        if (trainingAssignment.updatedAt) trainingAssignmentResponse.updatedAt = trainingAssignment.updatedAt;

        return trainingAssignmentResponse;
    };

    static toResponseList = (trainingAssignments: TrainingAssignment[]): TrainingAssignmentResponse[] => {
        return trainingAssignments.map(this.toResponse);
    };

    static toEntity = (createTrainingAssignmentRequest: CreateTrainingAssignmentRequest, trainingPlan: TrainingPlan, coach: Coach, player?: Player, team?: Team): TrainingAssignment => {
        const trainingAssignment = new TrainingAssignment();

        trainingAssignment.trainingPlan = trainingPlan;
        trainingAssignment.player = player;
        trainingAssignment.team = team;
        trainingAssignment.assignedByCoach = coach;
        trainingAssignment.status = TrainingAssignmentStatus.PENDING;
        trainingAssignment.startDate = createTrainingAssignmentRequest.startDate;
        trainingAssignment.endDate = createTrainingAssignmentRequest.endDate;

        return trainingAssignment;
    };
}