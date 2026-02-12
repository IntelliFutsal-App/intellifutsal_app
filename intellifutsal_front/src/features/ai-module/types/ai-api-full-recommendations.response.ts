import type { AiApiRequest } from "./ai-api.request";
import type { PhysicalConditionResponse } from "./physical-condition.response";
import type { PositionResponse } from "./position.response";

export interface AiApiFullRecommendationsResponse {
    position: PositionResponse;
    physicalCondition: PhysicalConditionResponse;
    specificRecommendations: string[];
    features: AiApiRequest;
    success: boolean;
};