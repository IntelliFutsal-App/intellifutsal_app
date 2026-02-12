export interface CoachResponse {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: Date;
    age: number;
    expYears: number;
    specialty: string;
    credentialId: number;
    status: boolean;
    createdAt: Date;
    updatedAt?: Date | null;
}