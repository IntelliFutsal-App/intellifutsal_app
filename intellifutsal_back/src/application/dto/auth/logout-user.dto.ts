import Joi from "joi";


export const logoutSchema = Joi.object({
    refreshToken: Joi.string()
        .trim()
        .min(20) 
        .max(500)
        .required()
        .messages({
            "string.base": "El token de refresco debe ser un texto",
            "string.empty": "El token de refresco es obligatorio",
            "string.min": "El token de refresco no tiene un formato válido",
            "string.max": "El token de refresco no tiene un formato válido",
            "any.required": "El token de refresco es obligatorio"
        })
}).options({ abortEarly: false, stripUnknown: true });