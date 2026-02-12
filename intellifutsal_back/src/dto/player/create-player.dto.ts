import Joi from "joi";


export const createPlayerSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/)
        .required()
        .messages({
            "string.base": "El nombre debe ser una cadena de texto",
            "string.empty": "El nombre es obligatorio",
            "string.min": "El nombre debe tener al menos 2 caracteres",
            "string.max": "El nombre debe tener como máximo 100 caracteres",
            "string.pattern.base": "El nombre solo puede contener letras, espacios, apóstrofes y guiones",
            "any.required": "El nombre es obligatorio"
        }),
    lastName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/)
        .required()
        .messages({
            "string.base": "El apellido debe ser una cadena de texto",
            "string.empty": "El apellido es obligatorio",
            "string.min": "El apellido debe tener al menos 2 caracteres",
            "string.max": "El apellido debe tener como máximo 100 caracteres",
            "string.pattern.base": "El apellido solo puede contener letras, espacios, apóstrofes y guiones",
            "any.required": "El apellido es obligatorio"
        }),
    birthDate: Joi.date()
        .iso()
        .max("now")
        .required()
        .messages({
            "date.base": "La fecha de nacimiento debe ser una fecha válida",
            "date.format": "La fecha de nacimiento debe tener el formato ISO (YYYY-MM-DD)",
            "date.max": "La fecha de nacimiento no puede ser en el futuro",
            "any.required": "La fecha de nacimiento es obligatoria"
        }),
    height: Joi.number()
        .positive()
        .precision(2)
        .min(0.5)
        .max(2.5)
        .required()
        .messages({
            "number.base": "La estatura debe ser un número",
            "number.positive": "La estatura debe ser un número positivo",
            "number.min": "La estatura debe ser de al menos 0.5 metros",
            "number.max": "La estatura debe ser de como máximo 2.5 metros",
            "any.required": "La estatura es obligatoria"
        }),
    weight: Joi.number()
        .positive()
        .precision(2)
        .min(30)
        .max(200)
        .required()
        .messages({
            "number.base": "El peso debe ser un número",
            "number.positive": "El peso debe ser un número positivo",
            "number.min": "El peso debe ser de al menos 30 kg",
            "number.max": "El peso debe ser de como máximo 200 kg",
            "any.required": "El peso es obligatorio"
        }),
    highJump: Joi.number()
        .positive()
        .precision(2)
        .min(0)
        .max(2.0)
        .required()
        .messages({
            "number.base": "El salto vertical debe ser un número",
            "number.positive": "El salto vertical debe ser un número positivo",
            "number.min": "El salto vertical debe ser de al menos 0 metros",
            "number.max": "El salto vertical debe ser de como máximo 2.0 metros",
            "any.required": "El salto vertical es obligatorio"
        }),
    rightUnipodalJump: Joi.number()
        .positive()
        .precision(2)
        .min(0)
        .max(3.0)
        .required()
        .messages({
            "number.base": "El salto unipodal derecho debe ser un número",
            "number.positive": "El salto unipodal derecho debe ser un número positivo",
            "number.min": "El salto unipodal derecho debe ser de al menos 0 metros",
            "number.max": "El salto unipodal derecho debe ser de como máximo 3.0 metros",
            "any.required": "El salto unipodal derecho es obligatorio"
        }),
    leftUnipodalJump: Joi.number()
        .positive()
        .precision(2)
        .min(0)
        .max(3.0)
        .required()
        .messages({
            "number.base": "El salto unipodal izquierdo debe ser un número",
            "number.positive": "El salto unipodal izquierdo debe ser un número positivo",
            "number.min": "El salto unipodal izquierdo debe ser de al menos 0 metros",
            "number.max": "El salto unipodal izquierdo debe ser de como máximo 3.0 metros",
            "any.required": "El salto unipodal izquierdo es obligatorio"
        }),
    bipodalJump: Joi.number()
        .positive()
        .precision(2)
        .min(0)
        .max(3.0)
        .required()
        .messages({
            "number.base": "El salto bipodal debe ser un número",
            "number.positive": "El salto bipodal debe ser un número positivo",
            "number.min": "El salto bipodal debe ser de al menos 0 metros",
            "number.max": "El salto bipodal debe ser de como máximo 3.0 metros",
            "any.required": "El salto bipodal es obligatorio"
        }),
    thirtyMetersTime: Joi.number()
        .positive()
        .precision(2)
        .min(3)
        .max(10)
        .required()
        .messages({
            "number.base": "El tiempo en 30 metros debe ser un número",
            "number.positive": "El tiempo en 30 metros debe ser un número positivo",
            "number.min": "El tiempo en 30 metros debe ser de al menos 3 segundos",
            "number.max": "El tiempo en 30 metros debe ser de como máximo 10 segundos",
            "any.required": "El tiempo en 30 metros es obligatorio"
        }),
    thousandMetersTime: Joi.number()
        .positive()
        .precision(2)
        .min(120)
        .max(600)
        .required()
        .messages({
            "number.base": "El tiempo en 1000 metros debe ser un número",
            "number.positive": "El tiempo en 1000 metros debe ser un número positivo",
            "number.min": "El tiempo en 1000 metros debe ser de al menos 120 segundos",
            "number.max": "El tiempo en 1000 metros debe ser de como máximo 600 segundos",
            "any.required": "El tiempo en 1000 metros es obligatorio"
        }),
    position: Joi.string()
        .valid("PIVOT", "WINGER", "FIXO", "GOALKEEPER")
        .required()
        .messages({
            "string.empty": "La posición es obligatoria",
            "any.only": "La posición debe ser una de las siguientes: PIVOT, WINGER, FIXO, GOALKEEPER",
            "any.required": "La posición es obligatoria"
        })
}).options({ abortEarly: false, stripUnknown: true });
