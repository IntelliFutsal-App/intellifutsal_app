import { z } from "zod";

export const createManualTrainingPlanSchema = z.object({
    title: z
        .string()
        .min(5, "El título debe tener al menos 5 caracteres")
        .max(200, "El título debe tener máximo 200 caracteres"),
    description: z
        .string()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .max(1000, "La descripción debe tener máximo 1000 caracteres"),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"] as const, {
        message: "Selecciona una dificultad válida",
    }).optional(),
    durationMinutes: z
        .number()
        .min(15, "La duración mínima es 15 minutos")
        .max(240, "La duración máxima es 240 minutos")
        .optional(),
    focusArea: z
        .string()
        .min(3, "El área de enfoque debe tener al menos 3 caracteres")
        .max(100, "El área de enfoque debe tener máximo 100 caracteres")
        .optional(),
});

export type CreateManualTrainingPlanSchema = z.infer<typeof createManualTrainingPlanSchema>;