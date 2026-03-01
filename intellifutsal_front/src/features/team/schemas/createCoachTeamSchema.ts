import { z } from "zod";
import { dateString, notFuture, optionalDateString, positiveId } from "./commons";

export const createCoachTeamSchema = z
    .object({
        coachId: positiveId,
        teamId: positiveId,
        assignmentDate: dateString,
        endDate: optionalDateString,
    })
    .superRefine((val, ctx) => {
        const a = new Date(val.assignmentDate);
        if (!notFuture(a)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["assignmentDate"],
                message: "La fecha de asignación no puede estar en el futuro",
            });
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
            if (e.getTime() < a.getTime()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["endDate"],
                    message: "La fecha de finalización no puede ser anterior a la asignación",
                });
            }
        }
    });

export type CreateCoachTeamSchema = z.infer<typeof createCoachTeamSchema>;
