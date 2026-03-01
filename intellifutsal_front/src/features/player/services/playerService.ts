import { AxiosService } from "@shared/lib";
import type { PlayerResponse, CreatePlayerRequest, UpdatePlayerRequest } from "../types";
import { normalizePlayerDates } from "../utils";
import type { UpdateStatusRequest } from "@shared/types";

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

    async findAll(): Promise<PlayerResponse[]> {
        const response = await this.axios.get<PlayerResponse[]>(`${this.BASE_PATH}`);

        return response.data.map(normalizePlayerDates);
    }

    async findAllIncludingInactive(): Promise<PlayerResponse[]> {
        const response = await this.axios.get<PlayerResponse[]>(
            `${this.BASE_PATH}/inactive`
        );

        return response.data.map(normalizePlayerDates);
    }

    async findById(id: number): Promise<PlayerResponse> {
        const response = await this.axios.get<PlayerResponse>(`${this.BASE_PATH}/${id}`);

        return normalizePlayerDates(response.data);
    }

    async findByIdIncludingInactive(id: number): Promise<PlayerResponse> {
        const response = await this.axios.get<PlayerResponse>(
            `${this.BASE_PATH}/inactive/${id}`
        );

        return normalizePlayerDates(response.data);
    }

    async findByTeamId(teamId: number): Promise<PlayerResponse[]> {
        const response = await this.axios.get<PlayerResponse[]>(
            `${this.BASE_PATH}/team/${teamId}`
        );

        return response.data.map(normalizePlayerDates);
    }

    async create(data: CreatePlayerRequest): Promise<PlayerResponse> {
        const response = await this.axios.post<PlayerResponse>(`${this.BASE_PATH}`, {
            ...data,
        });

        return normalizePlayerDates(response.data);
    }

    async update(data: UpdatePlayerRequest): Promise<PlayerResponse> {
        const response = await this.axios.patch<PlayerResponse>(`${this.BASE_PATH}`, {
            ...data,
        });

        return normalizePlayerDates(response.data);
    }

    async updateStatus(id: number, data: UpdateStatusRequest): Promise<PlayerResponse> {
        const response = await this.axios.patch<PlayerResponse>(
            `${this.BASE_PATH}/status/${id}`,
            { ...data }
        );

        return normalizePlayerDates(response.data);
    }

    async delete(id: number): Promise<void> {
        await this.axios.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const playerService = PlayerService.getInstance();