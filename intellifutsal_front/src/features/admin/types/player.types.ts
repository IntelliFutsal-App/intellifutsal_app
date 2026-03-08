import type { SelectOption } from "@shared/ui";

export type PositionValue = "PIVOT" | "WINGER" | "FIXO" | "GOALKEEPER";

export const POSITION_OPTIONS: SelectOption[] = [
    { value: "PIVOT", label: "Pívot" },
    { value: "WINGER", label: "Ala" },
    { value: "FIXO", label: "Poste / Fixo" },
    { value: "GOALKEEPER", label: "Portero" },
];