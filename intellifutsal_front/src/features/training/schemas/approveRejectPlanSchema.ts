import { z } from "zod";

export const approveRejectPlanSchema = z.object({
    approvalComment: z
        .string()
        .max(500, "El comentario debe tener máximo 500 caracteres")
        .optional(),
});

export type ApproveRejectPlanSchema = z.infer<typeof approveRejectPlanSchema>;