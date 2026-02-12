import { AxiosService } from "@shared/lib";
import type { PlayerClusterResponse } from "../types";

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

    async findById(id: string): Promise<PlayerClusterResponse> {
        const response = await this.axios.get<PlayerClusterResponse>(`${this.BASE_PATH}/${id}`);

        return response.data;
    }
}

export const playerClusterService = PlayerClusterService.getInstance();