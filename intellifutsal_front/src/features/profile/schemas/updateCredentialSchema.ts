import { z } from "zod";

export const updateCredentialSchema = z
    .object({
        id: z.number().int().positive("El ID de las credenciales debe ser un número entero positivo"),
        email: z.string().email("Email inválido").optional().or(z.literal("")),
        password: z.string().min(8, "Mínimo 8 caracteres").optional().or(z.literal("")),
        confirmPassword: z.string().optional().or(z.literal("")),
    })
    .refine(
        (d) => !d.password || d.password === d.confirmPassword,
        { message: "Las contraseñas no coinciden", path: ["confirmPassword"] }
    );

export type UpdateCredentialSchema = z.infer<typeof updateCredentialSchema>;