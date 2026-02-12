import { CreatePlayerTeamRequest, PlayerTeamResponse, UpdatePlayerTeamRequest } from "../interfaces";
import { Player, PlayerTeam, Team } from "../models";


export class PlayerTeamMapper {
    static toResponse = (playerTeam: PlayerTeam): PlayerTeamResponse => {
        const playerTeamResponse = new PlayerTeamResponse();

        playerTeamResponse.id = playerTeam.id;
        playerTeamResponse.entryDate = playerTeam.entryDate;
        playerTeamResponse.exitDate = playerTeam.exitDate;
        playerTeamResponse.playerId = playerTeam.player.id;
        playerTeamResponse.teamId = playerTeam.team.id;
        playerTeamResponse.status = playerTeam.status;

        return playerTeamResponse;
    }

    static toResponseList = (playerTeams: PlayerTeam[]): PlayerTeamResponse[] => {
        return playerTeams.map(this.toResponse);
    }

    static toEntity = (createPlayerTeamRequest: CreatePlayerTeamRequest, player: Player, team: Team): PlayerTeam => {
        const playerTeam = new PlayerTeam();

        playerTeam.entryDate = createPlayerTeamRequest.entryDate;
        if (createPlayerTeamRequest.exitDate) playerTeam.exitDate = createPlayerTeamRequest.exitDate
        playerTeam.player = player;
        playerTeam.team = team;

        return playerTeam;
    }

    static toUpdateEntity = (updatePlayerTeamRequest: UpdatePlayerTeamRequest, player?: Player, team?: Team): PlayerTeam => {
        const playerTeam = new PlayerTeam();

        playerTeam.id = updatePlayerTeamRequest.id;
        
        if (updatePlayerTeamRequest.entryDate) playerTeam.entryDate = updatePlayerTeamRequest.entryDate;
        if (updatePlayerTeamRequest.exitDate) playerTeam.exitDate = updatePlayerTeamRequest.exitDate;
        if (player) playerTeam.player = player;
        if (team) playerTeam.team = team;

        return playerTeam;
    }
}