import { normalizeTrainingPlanDates } from "@shared/utils/trainingUtils";
import type { CreateTrainingPlanRequest, TrainingPlanResponse, UpdateTrainingPlanStatusRequest } from "../types";
import { AxiosService } from "@shared/lib";

class TrainingPlanService {
    private static instance: TrainingPlanService;
    private axios: AxiosService;
    private readonly BASE_PATH = "/training-plan";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): TrainingPlanService {
        if (!TrainingPlanService.instance) TrainingPlanService.instance = new TrainingPlanService();

        return TrainingPlanService.instance;
    }

    async findAll(): Promise<TrainingPlanResponse[]> {
        const res = await this.axios.get<TrainingPlanResponse[]>(`${this.BASE_PATH}`);

        return res.data.map(normalizeTrainingPlanDates);
    }

    async findById(id: number): Promise<TrainingPlanResponse> {
        const res = await this.axios.get<TrainingPlanResponse>(`${this.BASE_PATH}/${id}`);
        
        return normalizeTrainingPlanDates(res.data);
    }

    async createManual(data: CreateTrainingPlanRequest): Promise<TrainingPlanResponse> {
        const res = await this.axios.post<TrainingPlanResponse>(`${this.BASE_PATH}/manual`, {
            ...data,
        });

        return normalizeTrainingPlanDates(res.data);
    }

    async createFromAiForPlayer(playerId: number): Promise<TrainingPlanResponse> {
        const res = await this.axios.post<TrainingPlanResponse>(
            `${this.BASE_PATH}/player/ai/${playerId}`,
            undefined,
            { timeout: 60000 },
        );

        return normalizeTrainingPlanDates(res.data);
    }

    async createFromAiForTeam(teamId: number): Promise<TrainingPlanResponse> {
        const res = await this.axios.post<TrainingPlanResponse>(
            `${this.BASE_PATH}/team/ai/${teamId}`,
            undefined,
            { timeout: 60000 },
        );

        return normalizeTrainingPlanDates(res.data);
    }

    async approve(id: number, data: UpdateTrainingPlanStatusRequest): Promise<TrainingPlanResponse> {
        const res = await this.axios.patch<TrainingPlanResponse>(
            `${this.BASE_PATH}/approve/${id}`,
            { ...data }
        );

        return normalizeTrainingPlanDates(res.data);
    }

    async reject(id: number, data: UpdateTrainingPlanStatusRequest): Promise<TrainingPlanResponse> {
        const res = await this.axios.patch<TrainingPlanResponse>(
            `${this.BASE_PATH}/reject/${id}`,
            { ...data }
        );

        return normalizeTrainingPlanDates(res.data);
    }

    async archive(id: number): Promise<TrainingPlanResponse> {
        const res = await this.axios.patch<TrainingPlanResponse>(`${this.BASE_PATH}/archive/${id}`);

        return normalizeTrainingPlanDates(res.data);
    }
}

export const trainingPlanService = TrainingPlanService.getInstance();