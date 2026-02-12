import type { AiApiRequest } from "./ai-api.request";

export interface AiApiPhysicalResponse {
    clusterId: number;
    clusterName: string;
    description: string;
    developmentAreas: string[];
    strengths: string[];
    trainingRecommendations: string[];
    features: AiApiRequest;
    success: boolean;
};