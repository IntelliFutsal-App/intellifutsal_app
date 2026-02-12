import { PlayerPositionResultsResponse, TeamErrorResponse } from "../";


export class AiApiTeamPositionsResponse {
    teamName!: string;
    results!: PlayerPositionResultsResponse[];
    totalPlayers!: number;
    processedPlayers!: number;
    success!: boolean;
    failedPlayers!: number;
    errors!: TeamErrorResponse[];
}