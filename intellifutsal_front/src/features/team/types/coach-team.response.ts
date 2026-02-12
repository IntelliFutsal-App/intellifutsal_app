export interface CoachTeamResponse {
    id: number;
    assignmentDate: Date;
    endDate?: Date | null;
    coachId: number;
    teamId: number;
    status: boolean;
}