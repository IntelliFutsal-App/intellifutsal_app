import Joi from "joi";


export const createTeamSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/)
        .required()
        .messages({
            "string.base": "El nombre del equipo debe ser una cadena de texto",
            "string.empty": "El nombre del equipo es obligatorio",
            "string.min": "El nombre del equipo debe tener al menos 3 caracteres",
            "string.max": "El nombre del equipo debe tener menos de 50 caracteres",
            "string.pattern.base": "El nombre del equipo solo puede contener letras, números y espacios",
            "any.required": "El nombre del equipo es obligatorio"
        }),
    category: Joi.string()
        .trim()
        .valid("Junior", "Senior", "Amateur", "Professional")
        .required()
        .messages({
            "string.base": "La categoría debe ser una cadena de texto",
            "string.empty": "La categoría es obligatoria",
            "any.only": "La categoría debe ser una de las siguientes: Junior, Senior, Amateur o Professional",
            "any.required": "La categoría es obligatoria"
        })
}).options({ abortEarly: false, stripUnknown: true });
