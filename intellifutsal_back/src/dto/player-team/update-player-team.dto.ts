import Joi from "joi";


export const updatePlayerTeamSchema = Joi.object({
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
    entryDate: Joi.date()
        .iso()
        .max("now")
        .optional()
        .messages({
            "date.base": "La fecha de ingreso debe ser una fecha válida",
            "date.format": "La fecha de ingreso debe estar en formato ISO (YYYY-MM-DD)",
            "date.max": "La fecha de ingreso no puede ser una fecha futura"
        }),
    exitDate: Joi.date()
        .iso()
        .max("now")
        .optional()
        .messages({
            "date.base": "La fecha de salida debe ser una fecha válida",
            "date.format": "La fecha de salida debe estar en formato ISO (YYYY-MM-DD)",
            "date.max": "La fecha de salida no puede ser una fecha futura"
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
    teamId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del equipo debe ser un número",
            "number.integer": "El ID del equipo debe ser un número entero",
            "number.positive": "El ID del equipo debe ser un número positivo"
        })
}).options({ abortEarly: false, stripUnknown: true });
