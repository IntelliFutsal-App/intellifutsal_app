import { z } from "zod";

export const recordProgressSchema = z.object({
    completionPercentage: z
        .number()
        .min(0, "El porcentaje debe ser al menos 0%")
        .max(100, "El porcentaje no puede superar 100%"),
    notes: z.string().max(500, "Las notas no pueden exceder 500 caracteres").optional(),
});

export type RecordProgressSchema = z.infer<typeof recordProgressSchema>;