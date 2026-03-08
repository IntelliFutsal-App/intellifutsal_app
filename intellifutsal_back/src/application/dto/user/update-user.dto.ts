import Joi from "joi";


export const updateUserSchema = Joi.object({
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
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .max(150)
        .optional()
        .messages({
            "string.empty": "El correo electrónico es obligatorio",
            "string.email": "El correo electrónico debe tener un formato válido",
            "string.pattern.base": "El formato del correo electrónico es inválido",
            "string.max": "El correo electrónico debe tener menos de 150 caracteres"
        }),
    password: Joi.string()
        .min(8)
        .max(100)
        .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=\S+$).{8,}$/)
        .disallow("password", "12345678", "qwerty", "letmein")
        .optional()
        .messages({
            "string.empty": "La contraseña es obligatoria",
            "string.min": "La contraseña debe tener al menos 8 caracteres",
            "string.max": "La contraseña debe tener menos de 100 caracteres",
            "string.pattern.base": "La contraseña debe incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial",
            "any.invalid": "La contraseña es demasiado débil"
        })
}).options({ abortEarly: false, stripUnknown: true });
