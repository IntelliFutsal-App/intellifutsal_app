import Joi from "joi";


export const updateJoinRequestStatusSchema = Joi.object({
    reviewComment: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .optional()
        .messages({
            "string.base": "El comentario debe ser un texto",
            "string.min": "El comentario debe tener al menos 5 caracteres",
            "string.max": "El comentario debe tener como máximo 500 caracteres"
        })
}).options({ abortEarly: false, stripUnknown: true });