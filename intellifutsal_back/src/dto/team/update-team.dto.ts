import Joi from "joi";


export const updateTeamSchema = Joi.object({
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
    name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/)
        .optional()
        .messages({
            "string.base": "El nombre del equipo debe ser una cadena de texto",
            "string.empty": "El nombre del equipo no puede estar vacío",
            "string.min": "El nombre del equipo debe tener al menos 3 caracteres",
            "string.max": "El nombre del equipo debe tener menos de 50 caracteres",
            "string.pattern.base": "El nombre del equipo solo puede contener letras, números y espacios"
        }),
    category: Joi.string()
        .trim()
        .valid("Junior", "Senior", "Amateur", "Professional")
        .optional()
        .messages({
            "string.base": "La categoría debe ser una cadena de texto",
            "string.empty": "La categoría no puede estar vacía",
            "any.only": "La categoría debe ser una de las siguientes: Junior, Senior, Amateur o Professional"
        })
}).options({ abortEarly: false, stripUnknown: true });
