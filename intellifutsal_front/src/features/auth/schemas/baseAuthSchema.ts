import { z } from 'zod';
import type { Role } from '../types';

export const baseAuthSchema = z.object({
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
    confirmPassword: z
        .string()
        .min(1, 'Confirma tu contraseña')
        .max(50, 'La confirmación no debe exceder los 50 caracteres'),
    role: z.enum(["COACH", "PLAYER"] as Role[]),
    acceptTerms: z
        .boolean()
        .refine((val) => val === true, 'Debes aceptar los términos y condiciones')
});

export type BaseAuthFormData = z.infer<typeof baseAuthSchema>;