import { z } from "zod";

export const createCoachSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre debe tener máximo 100 caracteres")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo letras y espacios"),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido debe tener máximo 100 caracteres")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo letras y espacios"),
  birthDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Fecha inválida")
    .refine((date) => new Date(date) <= new Date(), "La fecha no puede ser futura"),
  expYears: z
    .number()
    .int("Debe ser un número entero")
    .min(0, "No puede ser negativo")
    .max(80, "No puede exceder 80 años"),
  specialty: z
    .string()
    .min(3, "La especialidad debe tener al menos 3 caracteres")
    .max(100, "La especialidad debe tener máximo 100 caracteres")
});

export type CreateCoachSchema = z.infer<typeof createCoachSchema>;