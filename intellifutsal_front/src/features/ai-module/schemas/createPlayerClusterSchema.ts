import { z } from "zod";

export const createPlayerClusterSchema = z.object({
    playerId: z.number().positive("Selecciona un jugador válido"),
    clusterId: z.number().positive("Selecciona un cluster válido"),
});

export type CreatePlayerClusterSchema = z.infer<typeof createPlayerClusterSchema>;