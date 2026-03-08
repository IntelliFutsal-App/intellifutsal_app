import Joi from "joi";


export const verifyTrainingProgressSchema = Joi.object({
    verificationComment: Joi.string()
        .trim()
        .max(1000)
        .optional()
        .messages({
            "string.base": "El comentario de verificación debe ser un texto",
            "string.max": "El comentario de verificación debe tener como máximo 1000 caracteres"
        })
}).options({ abortEarly: false, stripUnknown: true });