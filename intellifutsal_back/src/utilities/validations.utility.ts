import { JoiErrorMapper } from "../middlewares/error-validation.middleware";


export function validateRequest<T>(schema: any, request: T): T {
    const { error, value } = schema.validate(request);

    if (error) JoiErrorMapper.throwValidationError(error.details);
    
    return value;
}