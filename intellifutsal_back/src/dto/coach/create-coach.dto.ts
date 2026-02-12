import Joi from "joi";


export const createCoachSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .required()
        .messages({
            "string.base": "El nombre debe ser un texto",
            "string.empty": "El nombre es obligatorio",
            "string.min": "El nombre debe tener al menos 2 caracteres",
            "string.max": "El nombre debe tener como máximo 100 caracteres",
            "string.pattern.base": "El nombre solo puede contener letras y espacios",
            "any.required": "El nombre es obligatorio"
        }),
    lastName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .required()
        .messages({
            "string.base": "El apellido debe ser un texto",
            "string.empty": "El apellido es obligatorio",
            "string.min": "El apellido debe tener al menos 2 caracteres",
            "string.max": "El apellido debe tener como máximo 100 caracteres",
            "string.pattern.base": "El apellido solo puede contener letras y espacios",
            "any.required": "El apellido es obligatorio"
        }),
    birthDate: Joi.date()
        .iso()
        .max("now")
        .required()
        .messages({
            "date.base": "La fecha de nacimiento debe ser una fecha válida",
            "date.format": "La fecha de nacimiento debe estar en formato ISO (YYYY-MM-DD)",
            "date.max": "La fecha de nacimiento no puede ser en el futuro",
            "any.required": "La fecha de nacimiento es obligatoria"
        }),
    expYears: Joi.number()
        .integer()
        .min(0)
        .max(80)
        .required()
        .messages({
            "number.base": "Los años de experiencia deben ser un número",
            "number.integer": "Los años de experiencia deben ser un número entero",
            "number.min": "Los años de experiencia no pueden ser negativos",
            "number.max": "Los años de experiencia no pueden exceder 80 años",
            "any.required": "Los años de experiencia son obligatorios"
        }),
    specialty: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.base": "La especialidad debe ser un texto",
            "string.empty": "La especialidad es obligatoria",
            "string.min": "La especialidad debe tener al menos 3 caracteres",
            "string.max": "La especialidad debe tener como máximo 100 caracteres",
            "any.required": "La especialidad es obligatoria"
        })
}).options({ abortEarly: false, stripUnknown: true });
