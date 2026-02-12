import { AiApiRequest, PhysicalConditionResponse, PositionResponse } from "../";


export class AiApiFullRecommendationsResponse {
    position!: PositionResponse;
    physicalCondition!: PhysicalConditionResponse;
    specificRecommendations!: string[];
    features!: AiApiRequest;
    success!: boolean;
}