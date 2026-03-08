import Joi from "joi";


export const loginUserSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(100)
        .required()
        .messages({
            "string.base": "El correo electrónico debe ser un texto",
            "string.email": "El correo electrónico no tiene un formato válido",
            "string.max": "El correo electrónico debe tener como máximo 100 caracteres",
            "string.empty": "El correo electrónico es obligatorio",
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
            "string.pattern.base": "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial",
            "any.invalid": "La contraseña es demasiado débil o común",
            "any.required": "La contraseña es obligatoria"
        })
}).options({ abortEarly: false, stripUnknown: true });
