import Joi from "joi";


export const updateStatusSchema = Joi.object({
    status: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "El estado debe ser verdadero o falso",
            "any.required": "El estado es obligatorio"
        })
}).options({ abortEarly: false, stripUnknown: true });