import { AxiosService } from "@shared/lib";
import type { CoachTeamResponse, CreateCoachTeamRequest, UpdateCoachTeamRequest } from "../types";
import type { UpdateStatusRequest } from "@shared/types";

class CoachTeamService {
    private static instance: CoachTeamService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/coach-team";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): CoachTeamService {
        if (!CoachTeamService.instance) CoachTeamService.instance = new CoachTeamService();

        return CoachTeamService.instance;
    }

    async findAll(): Promise<CoachTeamResponse[]> {
        const response = await this.axios.get<CoachTeamResponse[]>(`${this.BASE_PATH}`);

        return response.data;
    }

    async findAllIncludingInactive(): Promise<CoachTeamResponse[]> {
        const response = await this.axios.get<CoachTeamResponse[]>(
            `${this.BASE_PATH}/inactive`
        );

        return response.data;
    }

    async findById(id: number): Promise<CoachTeamResponse> {
        const response = await this.axios.get<CoachTeamResponse>(
            `${this.BASE_PATH}/${id}`
        );

        return response.data;
    }

    async findByIdIncludingInactive(id: number): Promise<CoachTeamResponse> {
        const response = await this.axios.get<CoachTeamResponse>(
            `${this.BASE_PATH}/inactive/${id}`
        );

        return response.data;
    }

    async findByCoachId(coachId: number): Promise<CoachTeamResponse[]> {
        const response = await this.axios.get<CoachTeamResponse[]>(
            `${this.BASE_PATH}/coach/${coachId}`
        );

        return response.data;
    }

    async create(data: CreateCoachTeamRequest): Promise<CoachTeamResponse> {
        const response = await this.axios.post<CoachTeamResponse>(
            `${this.BASE_PATH}`,
            { ...data }
        );

        return response.data;
    }

    async update(data: UpdateCoachTeamRequest): Promise<CoachTeamResponse> {
        const response = await this.axios.patch<CoachTeamResponse>(
            `${this.BASE_PATH}`,
            { ...data }
        );

        return response.data;
    }

    async updateStatus(id: number, data: UpdateStatusRequest): Promise<CoachTeamResponse> {
        const response = await this.axios.patch<CoachTeamResponse>(
            `${this.BASE_PATH}/status/${id}`,
            { ...data }
        );

        return response.data;
    }

    async delete(id: number): Promise<void> {
        await this.axios.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const coachTeamService = CoachTeamService.getInstance();