import type { TeamAnalysisResultsResponse } from "./team-analysis-results.response";
import type { TeamErrorResponse } from "./team-error.response";
import type { TeamPlayersAnalysisResultsResponse } from "./team-players-analysis-results.response";

export type AiApiTeamAnalyzeResponse = {
    teamName: string;
    playerResults: TeamPlayersAnalysisResultsResponse[];
    teamAnalysis: TeamAnalysisResultsResponse;
    totalPlayers: number;
    processedPlayers: number;
    success: boolean;
    failedPlayers: number;
    errors: TeamErrorResponse[];
};