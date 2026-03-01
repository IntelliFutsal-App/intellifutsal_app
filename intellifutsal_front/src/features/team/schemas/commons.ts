import { z } from "zod";

export const dateString = z
    .string()
    .min(1, "Este campo es obligatorio")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida");

export const optionalDateString = z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Fecha inválida");

export const positiveId = z.number().int().positive("El ID debe ser un número entero positivo");

export const notFuture = (d: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return d.getTime() <= today.getTime();
};