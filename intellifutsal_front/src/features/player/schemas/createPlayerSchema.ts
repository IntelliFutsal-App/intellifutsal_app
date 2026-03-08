import { z } from "zod";
import type { Position } from "../types";

const optionalPositiveNumber = (min: number, max: number, minMsg: string, maxMsg: string) =>
    z.union([
        z.number().min(min, minMsg).max(max, maxMsg),
        z.nan().transform(() => undefined),
    ]).optional();

export const createPlayerSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre debe tener máximo 100 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s"-]+$/, "Solo letras, espacios, apóstrofes y guiones"),
    lastName: z
        .string()
        .trim()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(100, "El apellido debe tener máximo 100 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s"-]+$/, "Solo letras, espacios, apóstrofes y guiones"),
    birthDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), "Fecha inválida")
        .refine((date) => new Date(date) <= new Date(), "La fecha no puede ser futura"),
    height: optionalPositiveNumber(0.5, 2.5, "La altura mínima es 0.5 metros", "La altura máxima es 2.5 metros"),
    weight: optionalPositiveNumber(30, 200, "El peso mínimo es 30 kg", "El peso máximo es 200 kg"),
    highJump: optionalPositiveNumber(0, 2.0, "No puede ser negativo", "El máximo es 2.0 metros"),
    rightUnipodalJump: optionalPositiveNumber(0, 3.0, "No puede ser negativo", "El máximo es 3.0 metros"),
    leftUnipodalJump: optionalPositiveNumber(0, 3.0, "No puede ser negativo", "El máximo es 3.0 metros"),
    bipodalJump: optionalPositiveNumber(0, 3.0, "No puede ser negativo", "El máximo es 3.0 metros"),
    thirtyMetersTime: optionalPositiveNumber(3, 10, "El mínimo es 3 segundos", "El máximo es 10 segundos"),
    thousandMetersTime: optionalPositiveNumber(120, 600, "El mínimo es 120 segundos", "El máximo es 600 segundos"),
    position: z.enum(["PIVOT", "WINGER", "FIXO", "GOALKEEPER"] as Position[]).optional().or(z.literal("")),
});

export type CreatePlayerSchema = z.infer<typeof createPlayerSchema>;