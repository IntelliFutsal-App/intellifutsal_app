import { AiApiRequest } from "..";


export class PlayerPositionResultsResponse {
    playerId!: number;
    playerName!: string;
    clusterId!: number;
    clusterName!: string;
    features!: AiApiRequest;
}