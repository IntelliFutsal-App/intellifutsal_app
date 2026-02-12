import { AxiosService } from "@shared/lib";
import type { CreateJoinRequestRequest, JoinRequestResponse, UpdateJoinRequestStatusRequest } from "../types";

class JoinRequestService {
    private static instance: JoinRequestService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/join-request";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): JoinRequestService {
        if (!JoinRequestService.instance) JoinRequestService.instance = new JoinRequestService();

        return JoinRequestService.instance;
    }

    async create(data: CreateJoinRequestRequest): Promise<JoinRequestResponse> {
        const response = await this.axios.post<JoinRequestResponse>(`${this.BASE_PATH}`, data);
        
        return response.data;
    }

    async findAllPending(teamId: number): Promise<JoinRequestResponse[]> {
        const response = await this.axios.get<JoinRequestResponse[]>(`${this.BASE_PATH}/team/${teamId}`);
        
        return response.data;
    }

    async approve(id: number): Promise<JoinRequestResponse> {
        const response = await this.axios.patch<JoinRequestResponse>(`${this.BASE_PATH}/approve/${id}`);

        return response.data;
    }

    async reject(id: number, data?: UpdateJoinRequestStatusRequest): Promise<JoinRequestResponse> {
        const response = await this.axios.patch<JoinRequestResponse>(`${this.BASE_PATH}/reject/${id}`, {
            data,
        });
        
        return response.data;
    }

    async findMyRequests(): Promise<JoinRequestResponse[]> {
        const response = await this.axios.get<JoinRequestResponse[]>(`${this.BASE_PATH}/player/me`);

        return response.data;
    }

    async cancel(id: number): Promise<void> {
        await this.axios.patch(`${this.BASE_PATH}/cancel/${id}`);
    }
}

export const joinRequestService = JoinRequestService.getInstance();