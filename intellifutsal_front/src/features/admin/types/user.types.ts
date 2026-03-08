import type { SelectOption } from "@shared/ui";

export type RoleOptionValue = "ADMIN" | "COACH" | "PLAYER";

export const ROLE_OPTIONS: SelectOption[] = [
    { value: "ADMIN", label: "Administrador" },
    { value: "COACH", label: "Entrenador" },
    { value: "PLAYER", label: "Jugador" },
];