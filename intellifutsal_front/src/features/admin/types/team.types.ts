import type { SelectOption } from "@shared/components";

export type TeamCategory = "Junior" | "Senior" | "Amateur" | "Professional";

export const TEAM_CATEGORY_OPTIONS: SelectOption[] = [
    { value: "Junior", label: "Junior" },
    { value: "Senior", label: "Senior" },
    { value: "Amateur", label: "Amateur" },
    { value: "Professional", label: "Profesional" },
];