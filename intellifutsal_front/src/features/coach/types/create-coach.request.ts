export interface CreateCoachRequest {
    firstName: string;
    lastName: string;
    birthDate: Date | string;
    expYears: number;
    specialty: string;
}