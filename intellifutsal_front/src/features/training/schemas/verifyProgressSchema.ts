import { z } from "zod";

export const verifyProgressSchema = z.object({
    verificationComment: z.string().trim().max(500, "El comentario no puede exceder 500 caracteres").optional(),
});

export type VerifyProgressSchema = z.infer<typeof verifyProgressSchema>;