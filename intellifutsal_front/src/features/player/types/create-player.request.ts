export interface CreatePlayerRequest {
    firstName: string;
    lastName: string;
    birthDate: Date | string;
    height?: number | null;
    weight?: number | null;
    highJump?: number | null;
    rightUnipodalJump?: number | null;
    leftUnipodalJump?: number | null;
    bipodalJump?: number | null;
    thirtyMetersTime?: number | null;
    thousandMetersTime?: number | null;
    position?: string | null;
}