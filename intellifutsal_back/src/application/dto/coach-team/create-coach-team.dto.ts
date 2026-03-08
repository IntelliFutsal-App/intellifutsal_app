import Joi from "joi";


export const createCoachTeamSchema = Joi.object({
    assignmentDate: Joi.date()
        .iso()
        .max("now")
        .required()
        .messages({
            "date.base": "La fecha de asignación debe ser una fecha válida",
            "date.format": "La fecha de asignación debe estar en formato ISO (YYYY-MM-DD)",
            "date.max": "La fecha de asignación no puede ser una fecha futura",
            "any.required": "La fecha de asignación es obligatoria"
        }),
    endDate: Joi.date()
        .iso()
        .max("now")
        .greater(Joi.ref("assignmentDate"))
        .optional()
        .messages({
            "date.base": "La fecha de finalización debe ser una fecha válida",
            "date.format": "La fecha de finalización debe estar en formato ISO (YYYY-MM-DD)",
            "date.max": "La fecha de finalización no puede ser una fecha futura",
            "date.greater": "La fecha de finalización debe ser posterior a la fecha de asignación"
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
