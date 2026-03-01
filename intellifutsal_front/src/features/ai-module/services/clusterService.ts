import { AxiosService } from "@shared/lib";
import type { ClusterResponse, CreateClusterRequest, UpdateClusterRequest } from "../types";

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

    async findById(id: number): Promise<ClusterResponse> {
        const response = await this.axios.get<ClusterResponse>(`${this.BASE_PATH}/${id}`);

        return response.data;
    }

    async create(data: CreateClusterRequest): Promise<ClusterResponse> {
        const response = await this.axios.post<ClusterResponse>(`${this.BASE_PATH}`, {
            ...data,
        });

        return response.data;
    }

    async update(data: UpdateClusterRequest): Promise<ClusterResponse> {
        const response = await this.axios.patch<ClusterResponse>(`${this.BASE_PATH}`, {
            ...data,
        });

        return response.data;
    }

    async delete(id: number): Promise<void> {
        await this.axios.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const clusterService = ClusterService.getInstance();