import { AxiosService } from "@shared/lib";
import type { PlayerTeamResponse, CreatePlayerTeamRequest, UpdatePlayerTeamRequest } from "../types";
import type { UpdateStatusRequest } from "@shared/types";

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

    async findAllIncludingInactive(): Promise<PlayerTeamResponse[]> {
        const response = await this.axios.get<PlayerTeamResponse[]>(
            `${this.BASE_PATH}/inactive`
        );

        return response.data;
    }

    async findById(id: number): Promise<PlayerTeamResponse> {
        const response = await this.axios.get<PlayerTeamResponse>(
            `${this.BASE_PATH}/${id}`
        );

        return response.data;
    }

    async findByIdIncludingInactive(id: number): Promise<PlayerTeamResponse> {
        const response = await this.axios.get<PlayerTeamResponse>(
            `${this.BASE_PATH}/inactive/${id}`
        );

        return response.data;
    }

    async findByPlayerId(playerId: number): Promise<PlayerTeamResponse[]> {
        const response = await this.axios.get<PlayerTeamResponse[]>(
            `${this.BASE_PATH}/player/${playerId}`
        );

        return response.data;
    }

    async create(data: CreatePlayerTeamRequest): Promise<PlayerTeamResponse> {
        const response = await this.axios.post<PlayerTeamResponse>(
            `${this.BASE_PATH}`,
            { ...data }
        );

        return response.data;
    }

    async update(data: UpdatePlayerTeamRequest): Promise<PlayerTeamResponse> {
        const response = await this.axios.patch<PlayerTeamResponse>(
            `${this.BASE_PATH}`,
            { ...data }
        );

        return response.data;
    }

    async updateStatus(id: number, data: UpdateStatusRequest): Promise<PlayerTeamResponse> {
        const response = await this.axios.patch<PlayerTeamResponse>(
            `${this.BASE_PATH}/status/${id}`,
            { ...data }
        );

        return response.data;
    }

    async delete(id: number): Promise<void> {
        await this.axios.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const playerTeamService = PlayerTeamService.getInstance();