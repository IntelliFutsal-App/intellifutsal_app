import { z } from "zod";

export const updateCredentialSchema = z
    .object({
        id: z.number().int().positive("El ID de las credenciales debe ser un número entero positivo"),
        email: z.string().trim().min(1, 'El correo electrónico es requerido').max(100, 'El correo electrónico no debe exceder los 100 caracteres').email('Ingresa un correo electrónico válido').optional().or(z.literal("")),
        password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(50, 'La contraseña no debe exceder los 50 caracteres').regex(/[A-Z]/, 'Debe contener al menos una mayúscula').regex(/[0-9]/, 'Debe contener al menos un número').regex(/[@$!%*?&]/, 'Debe contener al menos un carácter especial (@, $, !, %, *, ?, &)').optional().or(z.literal("")),
        confirmPassword: z.string().min(1, 'Confirma tu contraseña').max(50, 'La confirmación no debe exceder los 50 caracteres').optional().or(z.literal("")),
    })
    .refine(
        (d) => !d.password || d.password === d.confirmPassword,
        { message: "Las contraseñas no coinciden", path: ["confirmPassword"] }
    );

export type UpdateCredentialSchema = z.infer<typeof updateCredentialSchema>;