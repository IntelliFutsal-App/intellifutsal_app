import type { PlayerResponse } from "@features/player";
import type { ClusterResponse } from "../types";

export const toClusterOptions = (clusters: ClusterResponse[]) =>
    clusters.map((c) => ({ value: String(c.id), label: `#${c.id} — ${c.description}` }));

export const toPlayerOptions = (players: PlayerResponse[]) =>
    players.map((p) => ({
        value: String(p.id),
        label: `#${p.id} — ${p.firstName} ${p.lastName}`.trim(),
    }));