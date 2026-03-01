import { z } from "zod";

export const createClusterSchema = z.object({
    description: z
        .string()
        .trim()
        .min(3, "La descripción debe tener al menos 3 caracteres")
        .max(200, "La descripción no debe exceder 200 caracteres"),
});

export type CreateClusterSchema = z.infer<typeof createClusterSchema>;