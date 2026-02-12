import { CoachTeamResponse, CreateCoachTeamRequest, UpdateCoachTeamRequest } from "../interfaces";
import { Coach, CoachTeam, Team } from "../models";


export class CoachTeamMapper {
    static toResponse = (coachTeam: CoachTeam): CoachTeamResponse => {
        const coachTeamResponse = new CoachTeamResponse();

        coachTeamResponse.id = coachTeam.id;
        coachTeamResponse.assignmentDate = coachTeam.assignmentDate;
        coachTeamResponse.endDate = coachTeam.endDate;
        coachTeamResponse.coachId = coachTeam.coach.id;
        coachTeamResponse.teamId = coachTeam.team.id;
        coachTeamResponse.status = coachTeam.status;

        return coachTeamResponse;
    }

    static toResponseList = (coachTeams: CoachTeam[]): CoachTeamResponse[] => {
        return coachTeams.map(this.toResponse);
    }

    static toEntity = (createCoachTeamRequest: CreateCoachTeamRequest, coach: Coach, team: Team): CoachTeam => {
        const coachTeam = new CoachTeam();

        coachTeam.assignmentDate = createCoachTeamRequest.assignmentDate;
        if (createCoachTeamRequest.endDate) coachTeam.endDate = createCoachTeamRequest.endDate
        coachTeam.coach = coach;
        coachTeam.team = team;

        return coachTeam;
    }

    static toUpdateEntity = (updateCoachTeamRequest: UpdateCoachTeamRequest, coach?: Coach, team?: Team): CoachTeam => {
        const coachTeam = new CoachTeam();

        coachTeam.id = updateCoachTeamRequest.id;

        if (updateCoachTeamRequest.assignmentDate) coachTeam.assignmentDate = updateCoachTeamRequest.assignmentDate;
        if (updateCoachTeamRequest.endDate) coachTeam.endDate = updateCoachTeamRequest.endDate;
        if (coach) coachTeam.coach = coach;
        if (team) coachTeam.team = team;

        return coachTeam;
    }
}