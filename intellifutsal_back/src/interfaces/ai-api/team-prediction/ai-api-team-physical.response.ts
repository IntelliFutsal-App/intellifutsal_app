import { PlayerPhysicalResultsResponse, TeamErrorResponse } from "../";


export class AiApiTeamPhysicalResponse {
    teamName!: string;
    results!: PlayerPhysicalResultsResponse[];
    totalPlayers!: number;
    processedPlayers!: number;
    success!: boolean;
    failedPlayers!: number;
    errors!: TeamErrorResponse[];
}