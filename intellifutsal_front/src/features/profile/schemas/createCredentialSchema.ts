import type { Role } from "@features/auth";
import { z } from "zod";

export const createCredentialSchema = z.object({
    email: z.string().email("Email inválido").min(1, "Requerido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    role: z.enum(["ADMIN", "COACH", "PLAYER"] as Role[]),
});

export type CreateCredentialSchema = z.infer<typeof createCredentialSchema>;