import { AxiosService } from "@shared/lib";
import type { ProfileStateResponse } from "../types";

class ProfileService {
    private static instance: ProfileService;
    private axios: AxiosService;
    private readonly BASE_PATH: string = "/profile";

    private constructor() {
        this.axios = AxiosService.getInstance();
    }

    public static getInstance(): ProfileService {
        if (!ProfileService.instance) ProfileService.instance = new ProfileService();

        return ProfileService.instance;
    }

    async getProfile(): Promise<ProfileStateResponse> {
        const response = await this.axios.get<ProfileStateResponse>(`${this.BASE_PATH}/me`);
        
        return response.data;
    }
}

export const profileService = ProfileService.getInstance();