import Joi from "joi";


export const createTrainingProgressSchema = Joi.object({
    trainingAssignmentId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID de la asignación debe ser un número",
            "number.integer": "El ID de la asignación debe ser un número entero",
            "number.positive": "El ID de la asignación debe ser un número positivo",
            "any.required": "El ID de la asignación es obligatorio"
        }),
    progressDate: Joi.date()
        .required()
        .messages({
            "date.base": "La fecha de progreso no es válida",
            "any.required": "La fecha de progreso es obligatoria"
        }),
    completionPercentage: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required()
        .messages({
            "number.base": "El porcentaje de avance debe ser un número",
            "number.integer": "El porcentaje de avance debe ser un número entero",
            "number.min": "El porcentaje de avance no puede ser menor a 0",
            "number.max": "El porcentaje de avance no puede ser mayor a 100",
            "any.required": "El porcentaje de avance es obligatorio"
        }),
    notes: Joi.string()
        .trim()
        .max(1000)
        .optional()
        .messages({
            "string.base": "Las notas deben ser un texto",
            "string.max": "Las notas deben tener como máximo 1000 caracteres"
        })
}).options({ abortEarly: false, stripUnknown: true });