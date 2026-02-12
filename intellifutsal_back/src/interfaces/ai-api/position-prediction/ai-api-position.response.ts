import { AiApiRequest } from "../";


export class AiApiPositionResponse {
    clusterId!: number;
    clusterName!: string;
    features!: AiApiRequest;
    success!: boolean;
}