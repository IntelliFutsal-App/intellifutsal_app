import Joi from "joi";


export const createTrainingPlanSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(5)
        .max(255)
        .required()
        .messages({
            "string.base": "El título debe ser un texto",
            "string.empty": "El título es obligatorio",
            "string.min": "El título debe tener al menos 5 caracteres",
            "string.max": "El título debe tener como máximo 255 caracteres",
            "any.required": "El título es obligatorio"
        }),
    description: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .required()
        .messages({
            "string.base": "La descripción debe ser un texto",
            "string.empty": "La descripción es obligatoria",
            "string.min": "La descripción debe tener al menos 10 caracteres",
            "string.max": "La descripción debe tener como máximo 2000 caracteres",
            "any.required": "La descripción es obligatoria"
        }),
    difficulty: Joi.string()
        .trim()
        .max(50)
        .optional()
        .messages({
            "string.base": "La dificultad debe ser un texto",
            "string.max": "La dificultad debe tener como máximo 50 caracteres"
        }),
    durationMinutes: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "La duración debe ser un número",
            "number.integer": "La duración debe ser un número entero",
            "number.positive": "La duración debe ser un número positivo"
        }),
    focusArea: Joi.string()
        .trim()
        .max(100)
        .optional()
        .messages({
            "string.base": "El área de enfoque debe ser un texto",
            "string.max": "El área de enfoque debe tener como máximo 100 caracteres"
        }),
    clusterId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del cluster debe ser un número",
            "number.integer": "El ID del cluster debe ser un número entero",
            "number.positive": "El ID del cluster debe ser un número positivo"
        })
}).options({ abortEarly: false, stripUnknown: true });