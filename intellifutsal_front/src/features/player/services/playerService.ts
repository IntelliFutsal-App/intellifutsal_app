import { AxiosService } from "@shared/lib";
import type { CreatePlayerRequest, PlayerResponse, UpdatePlayerRequest } from "../types";
import { normalizePlayerDates } from "@shared/utils/playerUtils";

class PlayerService {
    private static instance: PlayerService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/player";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): PlayerService {
        if (!PlayerService.instance) PlayerService.instance = new PlayerService();

        return PlayerService.instance;
    }

    async create(data: CreatePlayerRequest): Promise<PlayerResponse> {
        const response = await this.axios.post<PlayerResponse>(`${this.BASE_PATH}`, {
            ...data
        });

        return normalizePlayerDates(response.data);
    }

    async update(data: UpdatePlayerRequest): Promise<PlayerResponse> {
        const response = await this.axios.patch<PlayerResponse>(`${this.BASE_PATH}`, {
            ...data
        });

        return normalizePlayerDates(response.data);
    }

    async findAll(): Promise<PlayerResponse[]> {
        const response = await this.axios.get<PlayerResponse[]>(`${this.BASE_PATH}`);

        return response.data.map(normalizePlayerDates);
    }

    async findById(id: number): Promise<PlayerResponse> {
        const response = await this.axios.get<PlayerResponse>(`${this.BASE_PATH}/${id}`);

        return normalizePlayerDates(response.data);
    }

    async findByTeamId(teamId: number): Promise<PlayerResponse[]> {
        const response = await this.axios.get<PlayerResponse[]>(`${this.BASE_PATH}/team/${teamId}`);

        return response.data.map(normalizePlayerDates);
    }
}

export const playerService = PlayerService.getInstance();