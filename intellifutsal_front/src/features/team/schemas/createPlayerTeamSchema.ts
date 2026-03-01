import { z } from "zod";
import { dateString, notFuture, optionalDateString, positiveId } from "./commons";

export const createPlayerTeamSchema = z
    .object({
        playerId: positiveId,
        teamId: positiveId,
        entryDate: dateString,
        exitDate: optionalDateString,
    })
    .superRefine((val, ctx) => {
        const a = new Date(val.entryDate);
        if (!notFuture(a)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["entryDate"],
                message: "La fecha de ingreso no puede estar en el futuro",
            });
        }

        if (val.exitDate) {
            const e = new Date(val.exitDate);
            if (!notFuture(e)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["exitDate"],
                    message: "La fecha de salida no puede estar en el futuro",
                });
            }
            if (e.getTime() < a.getTime()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["exitDate"],
                    message: "La fecha de salida no puede ser anterior al ingreso",
                });
            }
        }
    });

export type CreatePlayerTeamSchema = z.infer<typeof createPlayerTeamSchema>;