import Joi from "joi";


export const approveCoachSchema = Joi.object({
    coachCredentialId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID de la credencial del COACH debe ser un número",
            "number.integer": "El ID de la credencial del COACH debe ser un número entero",
            "number.positive": "El ID de la credencial del COACH debe ser un número positivo",
            "any.required": "El ID de la credencial del COACH es obligatorio"
        }),
    approved: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "El approved debe ser booleano",
            "any.required": "El approved es obligatorio",
        }),
}).options({ abortEarly: false, stripUnknown: true });