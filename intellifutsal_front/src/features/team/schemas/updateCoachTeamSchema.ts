import { z } from "zod";
import { notFuture, optionalDateString, positiveId } from "./commons";

export const updateCoachTeamSchema = z
    .object({
        id: positiveId,
        coachId: positiveId.optional(),
        teamId: positiveId.optional(),
        assignmentDate: optionalDateString,
        endDate: optionalDateString,
    })
    .superRefine((val, ctx) => {
        if (val.assignmentDate) {
            const a = new Date(val.assignmentDate);
            if (!notFuture(a)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["assignmentDate"],
                    message: "La fecha de asignación no puede estar en el futuro",
                });
            }
        }

        if (val.endDate) {
            const e = new Date(val.endDate);
            if (!notFuture(e)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["endDate"],
                    message: "La fecha de finalización no puede estar en el futuro",
                });
            }

            if (val.assignmentDate) {
                const a = new Date(val.assignmentDate);
                if (e.getTime() < a.getTime()) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["endDate"],
                        message: "La fecha de finalización no puede ser anterior a la asignación",
                    });
                }
            }
        }
    });

export type UpdateCoachTeamSchema = z.infer<typeof updateCoachTeamSchema>;
