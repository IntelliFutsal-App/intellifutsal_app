export interface UserResponse {
    id: number;
    email: string;
    role: string;
    onboardingStatus: string;
    status: boolean;
    createdAt: Date;
    updatedAt?: Date | null;
}