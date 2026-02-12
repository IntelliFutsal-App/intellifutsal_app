import { CreateTeamRequest, TeamResponse, TeamStats, UpdateTeamRequest } from "../interfaces";
import { Team } from "../models";


export class TeamMapper {
    static toResponse = (team: Team, stats?: TeamStats): TeamResponse => {
        const teamResponse = new TeamResponse();

        teamResponse.id = team.id;
        teamResponse.name = team.name;
        teamResponse.category = team.category;
        teamResponse.playerCount = stats?.playerCount ?? 0;
        teamResponse.averageAge = stats?.averageAge ?? 0;
        teamResponse.status = team.status;
        teamResponse.createdAt = team.createdAt;
        if (team.updatedAt) teamResponse.updatedAt = team.updatedAt;

        return teamResponse;
    };

    static toResponseList = (teams: Team[], statsByTeamId: Map<number, TeamStats>): TeamResponse[] => {
        return teams.map((t) => this.toResponse(t, statsByTeamId.get(t.id)));
    };

    static toEntity = (createTeamRequest: CreateTeamRequest): Team => {
        const team = new Team();

        team.name = createTeamRequest.name;
        team.category = createTeamRequest.category;
        
        return team;
    };

    static toUpdateEntity = (updateTeamRequest: UpdateTeamRequest): Team => {
        const team = new Team();

        team.id = updateTeamRequest.id;
        if (updateTeamRequest.name) team.name = updateTeamRequest.name;
        if (updateTeamRequest.category) team.category = updateTeamRequest.category;
        
        return team;
    };
}