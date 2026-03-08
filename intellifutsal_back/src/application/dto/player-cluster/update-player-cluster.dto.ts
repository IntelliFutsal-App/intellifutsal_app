import Joi from "joi";


export const updatePlayerClusterSchema = Joi.object({
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
    playerId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del jugador debe ser un número",
            "number.integer": "El ID del jugador debe ser un número entero",
            "number.positive": "El ID del jugador debe ser un número positivo"
        }),
    clusterId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del clúster debe ser un número",
            "number.integer": "El ID del clúster debe ser un número entero",
            "number.positive": "El ID del clúster debe ser un número positivo"
        })
}).options({ abortEarly: false, stripUnknown: true });
