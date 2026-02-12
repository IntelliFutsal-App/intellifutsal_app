import { AxiosService } from "@shared/lib";
import type { PlayerTeamResponse } from "../types";

class PlayerTeamService {
    private static instance: PlayerTeamService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/player-team";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): PlayerTeamService {
        if (!PlayerTeamService.instance) PlayerTeamService.instance = new PlayerTeamService();

        return PlayerTeamService.instance;
    }

    async findAll(): Promise<PlayerTeamResponse[]> {
        const response = await this.axios.get<PlayerTeamResponse[]>(`${this.BASE_PATH}`);

        return response.data;
    }

    async findById(id: string): Promise<PlayerTeamResponse> {
        const response = await this.axios.get<PlayerTeamResponse>(`${this.BASE_PATH}/${id}`);

        return response.data;
    }
}

export const playerTeamService = PlayerTeamService.getInstance();