export class PlayerResponse {
    id!: number;
    firstName!: string;
    lastName!: string;
    birthDate!: Date;
    age!: number;
    height?: number | null;
    weight?: number | null;
    bmi?: number | null;
    highJump?: number | null;
    rightUnipodalJump?: number | null;
    leftUnipodalJump?: number | null;
    bipodalJump?: number | null;
    thirtyMetersTime?: number | null;
    thousandMetersTime?: number | null;
    position?: string | null;
    status!: boolean;
    createdAt!: Date;
    updatedAt?: Date | null;
    credentialId!: number;
}