import Joi from "joi";


export const createJoinRequestSchema = Joi.object({
    teamId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID del equipo debe ser un número",
            "number.integer": "El ID del equipo debe ser un número entero",
            "number.positive": "El ID del equipo debe ser un número positivo",
            "any.required": "El ID del equipo es obligatorio"
        })
}).options({ abortEarly: false, stripUnknown: true });