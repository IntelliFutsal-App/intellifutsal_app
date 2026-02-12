import { AiApiAnalyzeResponse, AiApiFullRecommendationsResponse, AiApiPhysicalResponse, AiApiPositionResponse, AiApiTeamAnalyzeResponse, AiApiTeamPhysicalResponse, AiApiTeamPositionsResponse } from "../interfaces";


export interface IAiApiService {
    predictPosition(playerId: number): Promise<AiApiPositionResponse>;
    predictPhysical(playerId: number): Promise<AiApiPhysicalResponse>;
    analyzePrediction(playerId: number): Promise<AiApiAnalyzeResponse>;
    analyzeTeamPrediction(teamId: number): Promise<AiApiTeamAnalyzeResponse>;
    fullRecommendationsPrediction(playerId: number): Promise<AiApiFullRecommendationsResponse>;
    predictTeamPositions(teamId: number): Promise<AiApiTeamPositionsResponse>;
    predictTeamPhysical(teamId: number): Promise<AiApiTeamPhysicalResponse>;
}