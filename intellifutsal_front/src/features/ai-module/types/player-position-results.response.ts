import type { AiApiRequest } from "./ai-api.request";

export interface PlayerPositionResultsResponse {
    playerId: number;
    playerName: string;
    clusterId: number;
    clusterName: string;
    features: AiApiRequest;
};