import Joi from "joi";


export const createUserSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .max(150)
        .required()
        .messages({
            "string.empty": "El correo electrónico es obligatorio",
            "string.email": "El correo electrónico debe tener un formato válido",
            "string.pattern.base": "El formato del correo electrónico es inválido",
            "string.max": "El correo electrónico debe tener menos de 150 caracteres",
            "any.required": "El correo electrónico es obligatorio"
        }),
    password: Joi.string()
        .min(8)
        .max(100)
        .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=\S+$).{8,}$/)
        .disallow("password", "12345678", "qwerty", "letmein")
        .required()
        .messages({
            "string.empty": "La contraseña es obligatoria",
            "string.min": "La contraseña debe tener al menos 8 caracteres",
            "string.max": "La contraseña debe tener menos de 100 caracteres",
            "string.pattern.base": "La contraseña debe incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial",
            "any.invalid": "La contraseña es demasiado débil",
            "any.required": "La contraseña es obligatoria"
        }),
    role: Joi.string()
        .valid("PLAYER", "COACH")
        .required()
        .messages({
            "string.empty": "El rol es obligatorio",
            "any.only": "El rol debe ser PLAYER o COACH",
            "any.required": "El rol es obligatorio"
        })
}).options({ abortEarly: false, stripUnknown: true });
