import { AxiosService } from "@shared/lib";
import type { UpdateUserRequest, UserResponse } from "../types";

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

    async update(data: UpdateUserRequest): Promise<UserResponse> {
        const response = await this.axios.patch<UserResponse>(`${this.BASE_PATH}`, {
            ...data
        });

        return response.data;
    }
}

export const userService = UserService.getInstance();