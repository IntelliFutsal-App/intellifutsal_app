import { z } from "zod";

export const updateClusterSchema = z.object({
    id: z.number().int().positive("El ID del cluster debe ser un número entero positivo"),
    description: z
        .string()
        .trim()
        .min(3, "La descripción debe tener al menos 3 caracteres")
        .max(200, "La descripción no debe exceder 200 caracteres")
        .optional(),
});

export type UpdateClusterSchema = z.infer<typeof updateClusterSchema>;