import { AxiosService } from "@shared/lib";
import type { PlayerClusterResponse, CreatePlayerClusterRequest, UpdatePlayerClusterRequest } from "../types";

class PlayerClusterService {
    private static instance: PlayerClusterService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/player-cluster";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): PlayerClusterService {
        if (!PlayerClusterService.instance) PlayerClusterService.instance = new PlayerClusterService();

        return PlayerClusterService.instance;
    }

    async findAll(): Promise<PlayerClusterResponse[]> {
        const response = await this.axios.get<PlayerClusterResponse[]>(`${this.BASE_PATH}`);

        return response.data;
    }

    async findById(id: number): Promise<PlayerClusterResponse> {
        const response = await this.axios.get<PlayerClusterResponse>(
            `${this.BASE_PATH}/${id}`
        );

        return response.data;
    }

    async create(data: CreatePlayerClusterRequest): Promise<PlayerClusterResponse> {
        const response = await this.axios.post<PlayerClusterResponse>(
            `${this.BASE_PATH}`,
            { ...data }
        );

        return response.data;
    }

    async update(data: UpdatePlayerClusterRequest): Promise<PlayerClusterResponse> {
        const response = await this.axios.patch<PlayerClusterResponse>(
            `${this.BASE_PATH}`,
            { ...data }
        );

        return response.data;
    }

    async delete(id: number): Promise<void> {
        await this.axios.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const playerClusterService = PlayerClusterService.getInstance();