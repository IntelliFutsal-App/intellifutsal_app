import { z } from "zod";

export const planDecisionSchema = z.object({
    approvalComment: z
        .string()
        .trim()
        .max(300, "Máximo 300 caracteres")
        .optional()
        .or(z.literal("")),
});

export type PlanDecisionSchema = z.infer<typeof planDecisionSchema>;