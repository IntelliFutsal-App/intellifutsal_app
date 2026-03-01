import { AxiosService } from "@shared/lib";
import type { ApproveCoachRequest, CreateUserRequest, UpdateUserRequest, UserResponse } from "../types";
import type { CoachResponse } from "@features/coach";
import type { PlayerResponse } from "@features/player";
import type { UpdateStatusRequest } from "@shared/types";
import { normalizeUserDates } from "../utils";

class UserService {
    private static instance: UserService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/user";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): UserService {
        if (!UserService.instance) UserService.instance = new UserService();

        return UserService.instance;
    }

    async findAll(): Promise<UserResponse[]> {
        const response = await this.axios.get<UserResponse[]>(`${this.BASE_PATH}`);

        return response.data.map(normalizeUserDates);
    }

    async findAllIncludingInactive(): Promise<UserResponse[]> {
        const response = await this.axios.get<UserResponse[]>(
            `${this.BASE_PATH}/inactive`
        );

        return response.data.map(normalizeUserDates);
    }

    async findById(id: number): Promise<UserResponse> {
        const response = await this.axios.get<UserResponse>(`${this.BASE_PATH}/${id}`);

        return normalizeUserDates(response.data);
    }

    async findByIdIncludingInactive(id: number): Promise<UserResponse> {
        const response = await this.axios.get<UserResponse>(
            `${this.BASE_PATH}/inactive/${id}`
        );

        return normalizeUserDates(response.data);
    }

    async findByEmail(email: string): Promise<UserResponse> {
        const response = await this.axios.get<UserResponse>(
            `${this.BASE_PATH}/email/${encodeURIComponent(email)}`
        );

        return normalizeUserDates(response.data);
    }

    async findRoleEntityById(id: number): Promise<CoachResponse | PlayerResponse> {
        const response = await this.axios.get<CoachResponse | PlayerResponse>(
            `${this.BASE_PATH}/role/${id}`
        );

        return response.data;
    }

    async create(data: CreateUserRequest): Promise<UserResponse> {
        const response = await this.axios.post<UserResponse>(`${this.BASE_PATH}`, {
            ...data,
        });

        return normalizeUserDates(response.data);
    }

    async update(data: UpdateUserRequest): Promise<UserResponse> {
        const response = await this.axios.patch<UserResponse>(`${this.BASE_PATH}`, {
            ...data,
        });

        return normalizeUserDates(response.data);
    }

    async updateStatus(id: number, data: UpdateStatusRequest): Promise<UserResponse> {
        const response = await this.axios.patch<UserResponse>(
            `${this.BASE_PATH}/status/${id}`,
            { ...data }
        );

        return normalizeUserDates(response.data);
    }

    async approveCoach(request: ApproveCoachRequest): Promise<UserResponse> {
        const response = await this.axios.patch<UserResponse>(
            `${this.BASE_PATH}/approve-coach`,
            { ...request }
        );

        return normalizeUserDates(response.data);
    }

    async delete(id: number): Promise<void> {
        await this.axios.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const userService = UserService.getInstance();