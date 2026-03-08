import Joi from "joi";


export const registerUserSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(150)
        .required()
        .messages({
            "string.base": "El correo electrónico debe ser un texto",
            "string.empty": "El correo electrónico es obligatorio",
            "string.email": "El correo electrónico no tiene un formato válido",
            "string.max": "El correo electrónico debe tener como máximo 150 caracteres",
            "any.required": "El correo electrónico es obligatorio"
        }),
    password: Joi.string()
        .min(8)
        .max(100)
        .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=\S+$).{8,}$/)
        .disallow("password", "12345678", "qwerty", "letmein")
        .required()
        .messages({
            "string.base": "La contraseña debe ser un texto",
            "string.empty": "La contraseña es obligatoria",
            "string.min": "La contraseña debe tener al menos 8 caracteres",
            "string.max": "La contraseña debe tener como máximo 100 caracteres",
            "string.pattern.base": "La contraseña debe contener una mayúscula, una minúscula, un número y un carácter especial",
            "any.invalid": "La contraseña es demasiado débil o común",
            "any.required": "La contraseña es obligatoria"
        }),
    role: Joi.string()
        .valid("PLAYER", "COACH")
        .required()
        .messages({
            "string.base": "El rol debe ser un texto",
            "string.empty": "El rol es obligatorio",
            "any.only": "El rol debe ser PLAYER o COACH",
            "any.required": "El rol es obligatorio"
        })
}).options({ abortEarly: false, stripUnknown: true });
