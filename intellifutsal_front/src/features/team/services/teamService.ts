import { AxiosService } from "@shared/lib";
import type { TeamResponse, CreateTeamRequest, UpdateTeamRequest } from "../types";
import type { UpdateStatusRequest } from "@shared/types";

class TeamService {
    private static instance: TeamService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/team";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): TeamService {
        if (!TeamService.instance) TeamService.instance = new TeamService();

        return TeamService.instance;
    }

    async findAll(): Promise<TeamResponse[]> {
        const response = await this.axios.get<TeamResponse[]>(`${this.BASE_PATH}`);

        return response.data;
    }

    async findAllIncludingInactive(): Promise<TeamResponse[]> {
        const response = await this.axios.get<TeamResponse[]>(
            `${this.BASE_PATH}/inactive`
        );

        return response.data;
    }

    async findMyTeams(): Promise<TeamResponse[]> {
        const response = await this.axios.get<TeamResponse[]>(
            `${this.BASE_PATH}/my-teams`
        );

        return response.data;
    }

    async findById(id: number): Promise<TeamResponse> {
        const response = await this.axios.get<TeamResponse>(`${this.BASE_PATH}/${id}`);

        return response.data;
    }

    async findByIdIncludingInactive(id: number): Promise<TeamResponse> {
        const response = await this.axios.get<TeamResponse>(
            `${this.BASE_PATH}/inactive/${id}`
        );

        return response.data;
    }

    async create(data: CreateTeamRequest): Promise<TeamResponse> {
        const response = await this.axios.post<TeamResponse>(`${this.BASE_PATH}`, {
            ...data,
        });

        return response.data;
    }

    async update(data: UpdateTeamRequest): Promise<TeamResponse> {
        const response = await this.axios.patch<TeamResponse>(`${this.BASE_PATH}`, {
            ...data,
        });

        return response.data;
    }

    async updateStatus(id: number, data: UpdateStatusRequest): Promise<TeamResponse> {
        const response = await this.axios.patch<TeamResponse>(
            `${this.BASE_PATH}/status/${id}`,
            { ...data }
        );

        return response.data;
    }

    async delete(id: number): Promise<void> {
        await this.axios.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const teamService = TeamService.getInstance();