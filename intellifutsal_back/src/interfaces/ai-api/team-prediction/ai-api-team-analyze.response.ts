import { TeamPlayersAnalysisResultsResponse, TeamErrorResponse, TeamAnalysisResultsResponse } from "../";


export class AiApiTeamAnalyzeResponse {
    teamName!: string;
    playerResults!: TeamPlayersAnalysisResultsResponse[];
    teamAnalysis!: TeamAnalysisResultsResponse;
    totalPlayers!: number;
    processedPlayers!: number;
    success!: boolean;
    failedPlayers!: number;
    errors!: TeamErrorResponse[];
}