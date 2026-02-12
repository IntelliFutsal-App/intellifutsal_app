import type { OnboardingStatus } from "./onboarding-status";
import type { Role } from "./role";

export interface JwtPayload {
    id: number;
    email: string;
    role: Role;
    status: boolean;
    onboardingStatus: OnboardingStatus;
}