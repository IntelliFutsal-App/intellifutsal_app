import type { AiApiRequest } from "./ai-api.request";

export type AiApiPositionResponse = {
    clusterId: number;
    clusterName: string;
    features: AiApiRequest;
    success: boolean;
};