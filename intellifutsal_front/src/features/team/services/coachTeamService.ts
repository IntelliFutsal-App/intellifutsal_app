import { AxiosService } from "@shared/lib";
import type { CoachTeamResponse, CreateCoachTeamRequest } from "../types";

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

    async create(data: CreateCoachTeamRequest): Promise<CoachTeamResponse> {
        const response = await this.axios.post<CoachTeamResponse>(`${this.BASE_PATH}`, data);

        return response.data;
    }

    async findByCoachId(coachId: number): Promise<CoachTeamResponse[]> {
        const response = await this.axios.get<CoachTeamResponse[]>(`${this.BASE_PATH}/coach/${coachId}`);

        return response.data;
    }
}

export const coachTeamService = CoachTeamService.getInstance();
