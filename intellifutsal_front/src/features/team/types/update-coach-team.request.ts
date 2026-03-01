export interface UpdateCoachTeamRequest {
    id: number;
    assignmentDate?: Date;
    endDate?: Date;
    coachId?: number;
    teamId?: number;
}