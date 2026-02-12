import { AiApiRequest } from "../";


export class AiApiPhysicalResponse {
    clusterId!: number;
    clusterName!: string;
    description!: string;
    developmentAreas!: string[];
    strengths!: string[];
    trainingRecommendations!: string[];
    features!: AiApiRequest;
    success!: boolean;
}