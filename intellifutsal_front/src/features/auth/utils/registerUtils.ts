import type { RegisterFormData } from "../schemas";

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
    height?: number;
    weight?: number;
    highJump?: number;
    rightUnipodalJump?: number;
    leftUnipodalJump?: number;
    bipodalJump?: number;
    thirtyMetersTime?: number;
    thousandMetersTime?: number;
    position?: string;
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = data as any;
    const payload: PlayerCreatePayload = {
        firstName: d.firstName,
        lastName: d.lastName,
        birthDate: d.birthDate,
    };

    const optionalNumeric: (keyof PlayerCreatePayload)[] = [
        "height", "weight", "highJump", "rightUnipodalJump",
        "leftUnipodalJump", "bipodalJump", "thirtyMetersTime", "thousandMetersTime",
    ];
    for (const key of optionalNumeric) {
        const val = d[key];
        if (val != null && !Number.isNaN(val)) {
            (payload as Record<string, unknown>)[key] = val;
        }
    }

    if (d.position && d.position !== "") {
        payload.position = d.position;
    }

    return payload;
};