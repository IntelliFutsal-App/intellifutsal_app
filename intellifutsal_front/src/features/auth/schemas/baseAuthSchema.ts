import { z } from 'zod';
import type { Role } from '../types/role';

export const baseAuthSchema = z.object({
    email: z
        .string()
        .min(1, 'El correo electrónico es requerido')
        .email('Ingresa un correo electrónico válido'),
    password: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirmPassword: z
        .string()
        .min(1, 'Confirma tu contraseña'),
    role: z.enum(["COACH", "PLAYER", "ADMIN"] as Role[]),
    acceptTerms: z
        .boolean()
        .refine((val) => val === true, 'Debes aceptar los términos y condiciones')
});

export type BaseAuthFormData = z.infer<typeof baseAuthSchema>;