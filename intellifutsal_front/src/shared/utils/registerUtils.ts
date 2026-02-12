import type { RegisterFormData } from "@features/auth/schemas";

type CoachCreatePayload = {
    firstName: string;
    lastName: string;
    birthDate: string;
    expYears: number;
    specialty: string;
};

type PlayerCreatePayload = {
    firstName: string;
    lastName: string;
    birthDate: string;
    height: number;
    weight: number;
    highJump: number;
    rightUnipodalJump: number;
    leftUnipodalJump: number;
    bipodalJump: number;
    thirtyMetersTime: number;
    thousandMetersTime: number;
    position: string;
};

const isCoach = (data: RegisterFormData): data is RegisterFormData & { role: "COACH" } =>
    data.role === "COACH";

const isPlayer = (data: RegisterFormData): data is RegisterFormData & { role: "PLAYER" } =>
    data.role === "PLAYER";

export const toCoachPayload = (data: RegisterFormData): CoachCreatePayload => {
    if (!isCoach(data)) throw new Error("Role inválido para coach payload");

    const d = data as RegisterFormData & CoachCreatePayload;
    return {
        firstName: d.firstName,
        lastName: d.lastName,
        birthDate: d.birthDate,
        expYears: d.expYears,
        specialty: d.specialty,
    };
};

export const toPlayerPayload = (data: RegisterFormData): PlayerCreatePayload => {
    if (!isPlayer(data)) throw new Error("Role inválido para player payload");

    const d = data as RegisterFormData & PlayerCreatePayload;
    return {
        firstName: d.firstName,
        lastName: d.lastName,
        birthDate: d.birthDate,
        height: d.height,
        weight: d.weight,
        highJump: d.highJump,
        rightUnipodalJump: d.rightUnipodalJump,
        leftUnipodalJump: d.leftUnipodalJump,
        bipodalJump: d.bipodalJump,
        thirtyMetersTime: d.thirtyMetersTime,
        thousandMetersTime: d.thousandMetersTime,
        position: d.position,
    };
};