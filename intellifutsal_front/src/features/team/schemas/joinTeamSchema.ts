import { z } from "zod";

export const joinTeamSchema = z.object({
    teamId: z.number().positive("Selecciona un equipo válido")
});

export type JoinTeamSchema = z.infer<typeof joinTeamSchema>;