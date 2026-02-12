import Joi from "joi";


export const updateCoachTeamSchema = Joi.object({
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
    assignmentDate: Joi.date()
        .iso()
        .max("now")
        .optional()
        .messages({
            "date.base": "La fecha de asignación debe ser una fecha válida",
            "date.format": "La fecha de asignación debe estar en formato ISO (YYYY-MM-DD)",
            "date.max": "La fecha de asignación no puede ser una fecha futura"
        }),
    endDate: Joi.date()
        .iso()
        .max("now")
        .optional()
        .messages({
            "date.base": "La fecha de finalización debe ser una fecha válida",
            "date.format": "La fecha de finalización debe estar en formato ISO (YYYY-MM-DD)",
            "date.max": "La fecha de finalización no puede ser una fecha futura"
        }),
    coachId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del entrenador debe ser un número",
            "number.integer": "El ID del entrenador debe ser un número entero",
            "number.positive": "El ID del entrenador debe ser un número positivo"
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
