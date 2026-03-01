import { z } from "zod";
import { notFuture, optionalDateString, positiveId } from "./commons";

export const updatePlayerTeamSchema = z
    .object({
        id: positiveId,
        playerId: positiveId.optional(),
        teamId: positiveId.optional(),
        entryDate: optionalDateString,
        exitDate: optionalDateString,
    })
    .superRefine((val, ctx) => {
        if (val.entryDate) {
            const a = new Date(val.entryDate);
            if (!notFuture(a)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["entryDate"],
                    message: "La fecha de ingreso no puede estar en el futuro",
                });
            }
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

            if (val.entryDate) {
                const a = new Date(val.entryDate);
                if (e.getTime() < a.getTime()) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["exitDate"],
                        message: "La fecha de salida no puede ser anterior al ingreso",
                    });
                }
            }
        }
    });

export type UpdatePlayerTeamSchema = z.infer<typeof updatePlayerTeamSchema>;