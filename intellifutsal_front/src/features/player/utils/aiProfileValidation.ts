import type { PlayerResponse } from "../types";

const AI_REQUIRED_FIELDS: { key: keyof PlayerResponse; label: string }[] = [
    { key: "height", label: "Altura" },
    { key: "weight", label: "Peso" },
    { key: "highJump", label: "Salto Vertical" },
    { key: "rightUnipodalJump", label: "Salto Unipodal Der." },
    { key: "leftUnipodalJump", label: "Salto Unipodal Izq." },
    { key: "bipodalJump", label: "Salto Bipodal" },
    { key: "thirtyMetersTime", label: "Tiempo 30m" },
    { key: "thousandMetersTime", label: "Tiempo 1000m" },
    { key: "position", label: "Posición" },
];

export const getMissingPlayerAIFields = (player: PlayerResponse): string[] =>
    AI_REQUIRED_FIELDS
        .filter(({ key }) => player[key] == null)
        .map(({ label }) => label);

export const isPlayerProfileCompleteForAI = (player: PlayerResponse): boolean =>
    getMissingPlayerAIFields(player).length === 0;
