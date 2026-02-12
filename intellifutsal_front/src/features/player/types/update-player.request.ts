export interface UpdatePlayerRequest {
    id: number;
    firstName?: string;
    lastName?: string;
    birthDate?: Date | string;
    height?: number;
    weight?: number;
    highJump?: number;
    rightUnipodalJump?: number;
    leftUnipodalJump?: number;
    bipodalJump?: number;
    thirtyMetersTime?: number;
    thousandMetersTime?: number;
    position?: string;
}