import { AxiosService } from "@shared/lib";
import type { ClusterResponse } from "../types";

class ClusterService {
    private static instance: ClusterService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/cluster";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): ClusterService {
        if (!ClusterService.instance) ClusterService.instance = new ClusterService();

        return ClusterService.instance;
    }

    async findAll(): Promise<ClusterResponse[]> {
        const response = await this.axios.get<ClusterResponse[]>(`${this.BASE_PATH}`);

        return response.data;
    }

    async findById(id: string): Promise<ClusterResponse> {
        const response = await this.axios.get<ClusterResponse>(`${this.BASE_PATH}/${id}`);

        return response.data;
    }
}

export const clusterService = ClusterService.getInstance();