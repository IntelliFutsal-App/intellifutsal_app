import { z } from "zod";

export const updatePlayerClusterSchema = z.object({
    id: z.number().int().positive("El ID del player-cluster debe ser un número entero positivo"),
    playerId: z.number().int().positive("Jugador inválido").optional(),
    clusterId: z.number().int().positive("Cluster inválido").optional(),
});

export type UpdatePlayerClusterSchema = z.infer<typeof updatePlayerClusterSchema>;