import { AiApiRequest } from "..";


export class PlayerPhysicalResultsResponse {
    playerId!: number;
    playerName!: string;
    clusterId!: number;
    clusterName!: string;
    description!: string;
    developmentAreas!: string[];
    strengths!: string[];
    trainingRecommendations!: string[];
    features!: AiApiRequest;
}