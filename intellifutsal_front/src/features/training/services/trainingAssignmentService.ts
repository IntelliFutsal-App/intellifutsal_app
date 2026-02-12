import { AxiosService } from "@shared/lib";
import type { CreateTrainingAssignmentRequest, TrainingAssignmentResponse } from "../types";
import { normalizeTrainingAssignmentDates } from "@shared/utils/trainingUtils";

class TrainingAssignmentService {
    private static instance: TrainingAssignmentService;
    private axios: AxiosService;
    private readonly BASE_PATH = "/training-assignment";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): TrainingAssignmentService {
        if (!TrainingAssignmentService.instance) TrainingAssignmentService.instance = new TrainingAssignmentService();
        
        return TrainingAssignmentService.instance;
    }

    async findMyAssignments(): Promise<TrainingAssignmentResponse[]> {
        const res = await this.axios.get<TrainingAssignmentResponse[]>(
            `${this.BASE_PATH}/player/me`
        );

        return res.data.map(normalizeTrainingAssignmentDates);
    }

    async findByTeam(teamId: number): Promise<TrainingAssignmentResponse[]> {
        const res = await this.axios.get<TrainingAssignmentResponse[]>(
            `${this.BASE_PATH}/team/${teamId}`
        );

        return res.data.map(normalizeTrainingAssignmentDates);
    }

    async findById(id: number): Promise<TrainingAssignmentResponse> {
        const res = await this.axios.get<TrainingAssignmentResponse>(
            `${this.BASE_PATH}/${id}`
        );

        return normalizeTrainingAssignmentDates(res.data);
    }

    async create(data: CreateTrainingAssignmentRequest): Promise<TrainingAssignmentResponse> {
        const res = await this.axios.post<TrainingAssignmentResponse>(`${this.BASE_PATH}`, {
            ...data,
        });

        return normalizeTrainingAssignmentDates(res.data);
    }

    async activate(id: number): Promise<TrainingAssignmentResponse> {
        const res = await this.axios.patch<TrainingAssignmentResponse>(
            `${this.BASE_PATH}/activate/${id}`
        );

        return normalizeTrainingAssignmentDates(res.data);
    }

    async cancel(id: number): Promise<TrainingAssignmentResponse> {
        const res = await this.axios.patch<TrainingAssignmentResponse>(
            `${this.BASE_PATH}/cancel/${id}`
        );

        return normalizeTrainingAssignmentDates(res.data);
    }
}

export const trainingAssignmentService = TrainingAssignmentService.getInstance();