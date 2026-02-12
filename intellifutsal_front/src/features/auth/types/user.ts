import type { OnboardingStatus } from "./onboarding-status";
import type { Role } from "./role";

export interface User {
    id: number;
    email: string;
    username?: string;
    onboardingStatus: OnboardingStatus;
    role: Role;
    status: boolean;
}