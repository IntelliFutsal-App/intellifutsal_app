export class CoachResponse {
    id!: number;
    firstName!: string;
    lastName!: string;
    birthDate!: Date;
    age!: number;
    expYears!: number;
    specialty!: string;
    status!: boolean;
    createdAt!: Date;
    updatedAt?: Date | null;
    credentialId!: number;
}