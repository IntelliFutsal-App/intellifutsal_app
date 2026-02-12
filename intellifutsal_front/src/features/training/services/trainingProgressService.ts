import { AxiosService } from "@shared/lib";
import { normalizeTrainingProgressDates } from "@shared/utils/trainingUtils";
import type { CreateTrainingProgressRequest, TrainingProgressResponse, VerifyTrainingProgressRequest } from "../types";

class TrainingProgressService {
    private static instance: TrainingProgressService;
    private axios: AxiosService;
    private readonly BASE_PATH = "/training-progress";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): TrainingProgressService {
        if (!TrainingProgressService.instance) TrainingProgressService.instance = new TrainingProgressService();
        
        return TrainingProgressService.instance;
    }

    async findByAssignment(assignmentId: number): Promise<TrainingProgressResponse[]> {
        const res = await this.axios.get<TrainingProgressResponse[]>(
            `${this.BASE_PATH}/assignment/${assignmentId}`
        );

        return res.data.map(normalizeTrainingProgressDates);
    }

    async createByPlayer(data: CreateTrainingProgressRequest): Promise<TrainingProgressResponse> {
        const res = await this.axios.post<TrainingProgressResponse>(`${this.BASE_PATH}/player`, {
            ...data,
        });

        return normalizeTrainingProgressDates(res.data);
    }

    async verifyByCoach(progressId: number, data: VerifyTrainingProgressRequest): Promise<TrainingProgressResponse> {
        const res = await this.axios.patch<TrainingProgressResponse>(
            `${this.BASE_PATH}/verify/${progressId}`,
            { ...data }
        );

        return normalizeTrainingProgressDates(res.data);
    }
}

export const trainingProgressService = TrainingProgressService.getInstance();