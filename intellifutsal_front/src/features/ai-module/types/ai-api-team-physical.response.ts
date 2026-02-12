import type { PlayerPhysicalResultsResponse } from "./player-physical-results.response";
import type { TeamErrorResponse } from "./team-error.response";

export type AiApiTeamPhysicalResponse = {
    teamName: string;
    results: PlayerPhysicalResultsResponse[];
    totalPlayers: number;
    processedPlayers: number;
    success: boolean;
    failedPlayers: number;
    errors: TeamErrorResponse[];
};