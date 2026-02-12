import type { AiApiRequest } from "./ai-api.request";

export interface PlayerPhysicalResultsResponse {
    playerId: number;
    playerName: string;
    clusterId: number;
    clusterName: string;
    description: string;
    developmentAreas: string[];
    strengths: string[];
    trainingRecommendations: string[];
    features: AiApiRequest;
};