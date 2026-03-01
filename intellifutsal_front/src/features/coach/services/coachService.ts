import { AxiosService } from "@shared/lib";
import type { CoachResponse, CreateCoachRequest, UpdateCoachRequest } from "../types";
import type { UpdateStatusRequest } from "@shared/types";

class CoachService {
    private static instance: CoachService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/coach";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): CoachService {
        if (!CoachService.instance) CoachService.instance = new CoachService();

        return CoachService.instance;
    }

    async findAll(): Promise<CoachResponse[]> {
        const response = await this.axios.get<CoachResponse[]>(`${this.BASE_PATH}`);

        return response.data;
    }

    async findAllIncludingInactive(): Promise<CoachResponse[]> {
        const response = await this.axios.get<CoachResponse[]>(
            `${this.BASE_PATH}/inactive`
        );

        return response.data;
    }

    async findById(id: number): Promise<CoachResponse> {
        const response = await this.axios.get<CoachResponse>(
            `${this.BASE_PATH}/${id}`
        );

        return response.data;
    }

    async findByIdIncludingInactive(id: number): Promise<CoachResponse> {
        const response = await this.axios.get<CoachResponse>(
            `${this.BASE_PATH}/inactive/${id}`
        );

        return response.data;
    }

    async create(data: CreateCoachRequest): Promise<CoachResponse> {
        const response = await this.axios.post<CoachResponse>(
            `${this.BASE_PATH}`,
            { ...data }
        );

        return response.data;
    }

    async update(data: UpdateCoachRequest): Promise<CoachResponse> {
        const response = await this.axios.patch<CoachResponse>(
            `${this.BASE_PATH}`,
            { ...data }
        );

        return response.data;
    }

    async updateStatus(id: number, data: UpdateStatusRequest): Promise<CoachResponse> {
        const response = await this.axios.patch<CoachResponse>(
            `${this.BASE_PATH}/status/${id}`,
            { ...data }
        );

        return response.data;
    }

    async delete(id: number): Promise<void> {
        await this.axios.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const coachService = CoachService.getInstance();