import Joi from "joi";


export const createTrainingAssignmentSchema = Joi.object({
    trainingPlanId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID del plan debe ser un número",
            "number.integer": "El ID del plan debe ser un número entero",
            "number.positive": "El ID del plan debe ser un número positivo",
            "any.required": "El ID del plan es obligatorio"
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
        }),
    startDate: Joi.date()
        .optional()
        .messages({
            "date.base": "La fecha de inicio no es válida"
        }),
    endDate: Joi.date()
        .optional()
        .messages({
            "date.base": "La fecha de fin no es válida"
        })
})
    .or("playerId", "teamId")
    .messages({
        "object.missing": "Debe especificar al menos un jugador o un equipo para la asignación"
    })
    .options({ abortEarly: false, stripUnknown: true });