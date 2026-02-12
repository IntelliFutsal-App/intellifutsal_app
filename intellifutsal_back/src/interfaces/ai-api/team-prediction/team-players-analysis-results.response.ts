import { AiApiRequest } from "..";


export class TeamPlayersAnalysisResultsResponse {
    playerId!: number;
    playerName!: string;
    physicalCategory!: number;
    physicalName!: string;
    positionCategory!: number;
    positionName!: string;
    generalAnalysis!: string;
    strengths!: string[];
    weaknesses!: string[];
    trainingRecommendations!: string[];
    performanceProfile!: string;
    rawAnalysis!: string;
    rawFeatures!: AiApiRequest;
    success!: boolean;
}