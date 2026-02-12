import { createCoachSchema } from "@features/coach/schemas/coachSchema";
import { createPlayerSchema } from "@features/player/schemas/createPlayerSchema";
import { z } from "zod";
import { baseAuthSchema } from "./baseAuthSchema";

export const registerSchema = baseAuthSchema
    .and(
        z.discriminatedUnion('role', [
            createCoachSchema.extend({ role: z.literal("COACH") }),
            createPlayerSchema.extend({ role: z.literal("PLAYER") }),
            z.object({ role: z.literal("ADMIN") })
        ])
    )
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword']
});

export type RegisterFormData = z.infer<typeof registerSchema>;