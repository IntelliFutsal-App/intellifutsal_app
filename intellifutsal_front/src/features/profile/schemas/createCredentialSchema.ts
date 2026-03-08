import type { Role } from "@features/auth";
import { z } from "zod";

export const createCredentialSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'El correo electrónico es requerido')
        .max(100, 'El correo electrónico no debe exceder los 100 caracteres')
        .email('Ingresa un correo electrónico válido'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(50, 'La contraseña no debe exceder los 50 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número')
        .regex(/[@$!%*?&]/, 'Debe contener al menos un carácter especial (@, $, !, %, *, ?, &)'),
    role: z.enum(["ADMIN", "COACH", "PLAYER"] as Role[]),
});

export type CreateCredentialSchema = z.infer<typeof createCredentialSchema>;