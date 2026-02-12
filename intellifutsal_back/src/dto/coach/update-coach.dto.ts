import Joi from "joi";


export const updateCoachSchema = Joi.object({
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
    firstName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .optional()
        .messages({
            "string.base": "El nombre debe ser un texto",
            "string.min": "El nombre debe tener al menos 2 caracteres",
            "string.max": "El nombre debe tener como máximo 100 caracteres",
            "string.pattern.base": "El nombre solo puede contener letras y espacios"
        }),
    lastName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .optional()
        .messages({
            "string.base": "El apellido debe ser un texto",
            "string.min": "El apellido debe tener al menos 2 caracteres",
            "string.max": "El apellido debe tener como máximo 100 caracteres",
            "string.pattern.base": "El apellido solo puede contener letras y espacios"
        }),
    birthDate: Joi.date()
        .iso()
        .max("now")
        .optional()
        .messages({
            "date.base": "La fecha de nacimiento debe ser una fecha válida",
            "date.format": "La fecha de nacimiento debe estar en formato ISO (YYYY-MM-DD)",
            "date.max": "La fecha de nacimiento no puede ser en el futuro"
        }),
    expYears: Joi.number()
        .integer()
        .min(0)
        .max(80)
        .optional()
        .messages({
            "number.base": "Los años de experiencia deben ser un número",
            "number.integer": "Los años de experiencia deben ser un número entero",
            "number.min": "Los años de experiencia no pueden ser negativos",
            "number.max": "Los años de experiencia no pueden exceder 80 años"
        }),
    specialty: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .optional()
        .messages({
            "string.base": "La especialidad debe ser un texto",
            "string.min": "La especialidad debe tener al menos 3 caracteres",
            "string.max": "La especialidad debe tener como máximo 100 caracteres"
        })
}).options({ abortEarly: false, stripUnknown: true });
