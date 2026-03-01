import { z } from "zod";
import type { Category } from '../types';

export const updateTeamSchema = z.object({
    id: z.number().positive("El ID del equipo debe ser un número positivo"),
    name: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre debe tener máximo 50 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s"-]+$/, "Solo letras, espacios, apóstrofes y guiones"),
    category: z.enum(["Junior", "Senior", "Amateur", "Professional"] as Category[])
});

export type UpdateTeamSchema = z.infer<typeof updateTeamSchema>;
