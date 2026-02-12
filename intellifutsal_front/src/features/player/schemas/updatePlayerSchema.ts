import { z } from "zod";
import type { Position } from "../types";

export const updatePlayerSchema = z.object({
    id: z.number().positive("ID inválido"),
    firstName: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre debe tener máximo 100 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s"-]+$/, "Solo letras, espacios, apóstrofes y guiones"),
    lastName: z
        .string()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(100, "El apellido debe tener máximo 100 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s"-]+$/, "Solo letras, espacios, apóstrofes y guiones"),
    birthDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), "Fecha inválida")
        .refine((date) => new Date(date) <= new Date(), "La fecha no puede ser futura"),
    height: z
        .number()
        .min(0.5, "La altura mínima es 0.5 metros")
        .max(2.5, "La altura máxima es 2.5 metros"),
    weight: z
        .number()
        .min(30, "El peso mínimo es 30 kg")
        .max(200, "El peso máximo es 200 kg"),
    highJump: z
        .number()
        .min(0, "No puede ser negativo")
        .max(200, "El máximo es 200 cm"),
    rightUnipodalJump: z
        .number()
        .min(0, "No puede ser negativo")
        .max(300, "El máximo es 300 cm"),
    leftUnipodalJump: z
        .number()
        .min(0, "No puede ser negativo")
        .max(300, "El máximo es 300 cm"),
    bipodalJump: z
        .number()
        .min(0, "No puede ser negativo")
        .max(300, "El máximo es 300 cm"),
    thirtyMetersTime: z
        .number()
        .min(3, "El mínimo es 3 segundos")
        .max(10, "El máximo es 10 segundos"),
    thousandMetersTime: z
        .number()
        .min(120, "El mínimo es 120 segundos")
        .max(600, "El máximo es 600 segundos"),
    position: z.enum(["PIVOT", "WINGER", "FIXO", "GOALKEEPER"] as Position[]),
});

export type UpdatePlayerSchema = z.infer<typeof updatePlayerSchema>;