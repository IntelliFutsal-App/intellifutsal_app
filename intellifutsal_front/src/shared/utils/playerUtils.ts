import type { PlayerResponse } from "@features/player/types";

export const normalizePlayerDates = (p: PlayerResponse): PlayerResponse => ({
    ...p,
    birthDate: new Date(p.birthDate),
    createdAt: new Date(p.createdAt),
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : p.updatedAt,
});