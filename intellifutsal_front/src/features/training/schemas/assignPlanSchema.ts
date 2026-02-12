import { z } from "zod";

export const assignPlanSchema = z.object({
    target: z.enum(["player", "team"], {
        message: "Selecciona un tipo de asignación válido",
    }),
    playerId: z.number().optional(),
    teamId: z.number().optional(),
    startDate: z.string().min(1, "La fecha de inicio es requerida"),
    endDate: z.string().min(1, "La fecha de fin es requerida"),
}).refine(
    (data) => {
        if (data.target === "player") return !!data.playerId;
        if (data.target === "team") return !!data.teamId;
        return false;
    },
    {
        message: "Debes seleccionar un jugador o equipo",
        path: ["playerId"],
    }
);

export type AssignPlanSchema = z.infer<typeof assignPlanSchema>;