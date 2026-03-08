import Joi from "joi";


export const updatePlayerSchema = Joi.object({
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
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/)
        .optional()
        .messages({
            "string.base": "El nombre debe ser una cadena de texto",
            "string.min": "El nombre debe tener al menos 2 caracteres",
            "string.max": "El nombre no puede superar los 100 caracteres",
            "string.pattern.base": "El nombre solo puede contener letras, espacios, apóstrofes y guiones"
        }),
    lastName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/)
        .optional()
        .messages({
            "string.base": "El apellido debe ser una cadena de texto",
            "string.min": "El apellido debe tener al menos 2 caracteres",
            "string.max": "El apellido no puede superar los 100 caracteres",
            "string.pattern.base": "El apellido solo puede contener letras, espacios, apóstrofes y guiones"
        }),
    birthDate: Joi.date()
        .iso()
        .max("now")
        .optional()
        .messages({
            "date.base": "La fecha de nacimiento debe ser una fecha válida",
            "date.format": "La fecha de nacimiento debe tener el formato ISO (YYYY-MM-DD)",
            "date.max": "La fecha de nacimiento no puede estar en el futuro"
        }),
    height: Joi.number()
        .positive()
        .precision(2)
        .min(0.5)
        .max(2.5)
        .optional()
        .messages({
            "number.base": "La altura debe ser un número",
            "number.positive": "La altura debe ser un número positivo",
            "number.min": "La altura mínima es 0.5 metros",
            "number.max": "La altura máxima es 2.5 metros"
        }),
    weight: Joi.number()
        .positive()
        .precision(2)
        .min(30)
        .max(200)
        .optional()
        .messages({
            "number.base": "El peso debe ser un número",
            "number.positive": "El peso debe ser un número positivo",
            "number.min": "El peso mínimo es 30 kg",
            "number.max": "El peso máximo es 200 kg"
        }),
    highJump: Joi.number()
        .positive()
        .precision(2)
        .min(0)
        .max(2.0)
        .optional()
        .messages({
            "number.base": "El salto vertical debe ser un número",
            "number.positive": "El salto vertical debe ser un número positivo",
            "number.min": "El salto vertical debe ser de al menos 0 metros",
            "number.max": "El salto vertical debe ser de como máximo 2.0 metros"
        }),
    rightUnipodalJump: Joi.number()
        .positive()
        .precision(2)
        .min(0)
        .max(3.0)
        .optional()
        .messages({
            "number.base": "El salto unipodal derecho debe ser un número",
            "number.positive": "El salto unipodal derecho debe ser un número positivo",
            "number.min": "El salto unipodal derecho debe ser de al menos 0 metros",
            "number.max": "El salto unipodal derecho debe ser de como máximo 3.0 metros"
        }),
    leftUnipodalJump: Joi.number()
        .positive()
        .precision(2)
        .min(0)
        .max(3.0)
        .optional()
        .messages({
            "number.base": "El salto unipodal izquierdo debe ser un número",
            "number.positive": "El salto unipodal izquierdo debe ser un número positivo",
            "number.min": "El salto unipodal izquierdo debe ser de al menos 0 metros",
            "number.max": "El salto unipodal izquierdo debe ser de como máximo 3.0 metros"
        }),
    bipodalJump: Joi.number()
        .positive()
        .precision(2)
        .min(0)
        .max(3.0)
        .optional()
        .messages({
            "number.base": "El salto bipodal debe ser un número",
            "number.positive": "El salto bipodal debe ser un número positivo",
            "number.min": "El salto bipodal debe ser de al menos 0 metros",
            "number.max": "El salto bipodal debe ser de como máximo 3.0 metros",
        }),
    thirtyMetersTime: Joi.number()
        .positive()
        .precision(2)
        .min(3)
        .max(20)
        .optional()
        .messages({
            "number.base": "El tiempo en 30 metros debe ser un número",
            "number.positive": "El tiempo en 30 metros debe ser un número positivo",
            "number.min": "El tiempo en 30 metros debe ser de al menos 3 segundos",
            "number.max": "El tiempo en 30 metros debe ser de como máximo 20 segundos"
        }),
    thousandMetersTime: Joi.number()
        .positive()
        .precision(2)
        .min(120)
        .max(800)
        .optional()
        .messages({
            "number.base": "El tiempo en 1000 metros debe ser un número",
            "number.positive": "El tiempo en 1000 metros debe ser un número positivo",
            "number.min": "El tiempo en 1000 metros debe ser de al menos 120 segundos",
            "number.max": "El tiempo en 1000 metros debe ser de como máximo 600 segundos"
        }),
    position: Joi.string()
        .valid("PIVOT", "WINGER", "FIXO", "GOALKEEPER")
        .optional()
        .messages({
            "string.base": "La posición debe ser una cadena de texto",
            "any.only": "La posición debe ser una de las siguientes: PIVOT, WINGER, FIXO, GOALKEEPER"
        })
}).options({ abortEarly: false, stripUnknown: true });
