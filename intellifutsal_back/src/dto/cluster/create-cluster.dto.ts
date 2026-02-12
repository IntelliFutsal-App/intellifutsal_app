import Joi from "joi";


export const createClusterSchema = Joi.object({
    description: Joi.string()
        .trim()
        .min(5)
        .max(255)
        .required()
        .messages({
            "string.base": "La descripción debe ser un texto",
            "string.empty": "La descripción es obligatoria",
            "string.min": "La descripción debe tener al menos 5 caracteres",
            "string.max": "La descripción debe tener como máximo 255 caracteres",
            "any.required": "La descripción es obligatoria"
        })
}).options({ abortEarly: false, stripUnknown: true });
