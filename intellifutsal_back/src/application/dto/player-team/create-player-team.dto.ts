import Joi from "joi";


export const createPlayerTeamSchema = Joi.object({
    entryDate: Joi.date()
        .iso()
        .max("now")
        .required()
        .messages({
            "date.base": "La fecha de ingreso debe ser una fecha válida",
            "date.format": "La fecha de ingreso debe estar en formato ISO (YYYY-MM-DD)",
            "date.max": "La fecha de ingreso no puede ser una fecha futura",
            "any.required": "La fecha de ingreso es obligatoria"
        }),
    exitDate: Joi.date()
        .iso()
        .max("now")
        .greater(Joi.ref("entryDate"))
        .optional()
        .messages({
            "date.base": "La fecha de salida debe ser una fecha válida",
            "date.format": "La fecha de salida debe estar en formato ISO (YYYY-MM-DD)",
            "date.max": "La fecha de salida no puede ser una fecha futura",
            "date.greater": "La fecha de salida debe ser posterior a la fecha de ingreso"
        }),
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
