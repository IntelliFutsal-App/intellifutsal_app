import { z } from "zod";

export const createAiPlanSchema = z.object({
    target: z.enum(["player", "team"] as const, {
        message: "Selecciona un objetivo válido",
    }),
    playerId: z.number().positive("Selecciona un jugador válido").optional(),
    teamId: z.number().positive("Selecciona un equipo válido").optional(),
}).refine(
    (data) => {
        if (data.target === "player" && !data.playerId) return false;
        if (data.target === "team" && !data.teamId) return false;
        return true;
    },
    {
        message: "Debes seleccionar un jugador o equipo según el objetivo",
        path: ["playerId"],
    }
);

export type CreateAiPlanSchema = z.infer<typeof createAiPlanSchema>;