import Joi from "joi";


export const updateClusterSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID debe ser un número",
            "number.integer": "El ID debe ser un número entero",
            "number.positive": "El ID debe ser un número positivo",
            "any.required": "El ID es obligatorio"
        }),
    description: Joi.string()
        .trim()
        .min(5)
        .max(255)
        .optional()
        .messages({
            "string.base": "La descripción debe ser un texto",
            "string.empty": "La descripción no puede estar vacía",
            "string.min": "La descripción debe tener al menos 5 caracteres",
            "string.max": "La descripción debe tener como máximo 255 caracteres"
        })
}).options({ abortEarly: false, stripUnknown: true });
