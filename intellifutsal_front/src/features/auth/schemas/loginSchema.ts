import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "El correo electrónico es requerido")
        .max(100, "El correo electrónico no debe exceder los 100 caracteres")
        .email("Ingresa un correo electrónico válido"),
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(50, "La contraseña no debe exceder los 50 caracteres")
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número')
        .regex(/[@$!%*?&]/, 'Debe contener al menos un carácter especial (@, $, !, %, *, ?, &)'),
    rememberMe: z.boolean().optional()
});

export type LoginFormData = z.infer<typeof loginSchema>;