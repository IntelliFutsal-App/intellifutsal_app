import { AxiosService } from "@shared/lib";
import type { CreateTeamRequest, TeamResponse } from "../types";

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

    async findMyTeams(): Promise<TeamResponse[]> {
        const response = await this.axios.get<TeamResponse[]>(`${this.BASE_PATH}/my-teams`);
        
        return response.data;
    }

    async create(data: CreateTeamRequest): Promise<TeamResponse> {
        const response = await this.axios.post<TeamResponse>(`${this.BASE_PATH}`, data);

        return response.data;
    }

    async findById(id: number): Promise<TeamResponse> {
        const response = await this.axios.get<TeamResponse>(`${this.BASE_PATH}/${id}`);
        
        return response.data;
    }
}

export const teamService = TeamService.getInstance();