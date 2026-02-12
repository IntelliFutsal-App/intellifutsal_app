import Joi from "joi";


export const createPlayerClusterSchema = Joi.object({
    playerId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID del jugador debe ser un número",
            "number.integer": "El ID del jugador debe ser un número entero",
            "number.positive": "El ID del jugador debe ser un número positivo",
            "any.required": "El ID del jugador es obligatorio"
        }),
    clusterId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID del clúster debe ser un número",
            "number.integer": "El ID del clúster debe ser un número entero",
            "number.positive": "El ID del clúster debe ser un número positivo",
            "any.required": "El ID del clúster es obligatorio"
        })
}).options({ abortEarly: false, stripUnknown: true });
