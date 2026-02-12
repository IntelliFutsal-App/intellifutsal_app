import { OnboardingStatus, Role } from "../enums";


export interface JwtPayload {
    id: string;
    email: string;
    username?: string;
    role: Role; 
    onboardingStatus: OnboardingStatus;
    status: boolean;
}