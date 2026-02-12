import type { PlayerPositionResultsResponse } from "./player-position-results.response";
import type { TeamErrorResponse } from "./team-error.response";

export type AiApiTeamPositionsResponse = {
    teamName: string;
    results: PlayerPositionResultsResponse[];
    totalPlayers: number;
    processedPlayers: number;
    success: boolean;
    failedPlayers: number;
    errors: TeamErrorResponse[];
};