export class PlayerResponse {
    id!: number;
    firstName!: string;
    lastName!: string;
    birthDate!: Date;
    age!: number;
    height!: number;
    weight!: number;
    bmi!: number;
    highJump!: number;
    rightUnipodalJump!: number;
    leftUnipodalJump!: number;
    bipodalJump!: number;
    thirtyMetersTime!: number;
    thousandMetersTime!: number;
    position!: string;
    status!: boolean;
    createdAt!: Date;
    updatedAt?: Date | null;
    credentialId!: number;
}