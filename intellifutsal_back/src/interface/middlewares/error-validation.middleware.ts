import { ValidationErrorItem } from "joi";
import { ValidationException } from "../../domain/exceptions";
import { VALIDATION_REQUEST_FAILED } from '../../core/utilities/messages.utility';


interface ValidationErrors {
    [key: string]: string;
}

export class JoiErrorMapper {
    static mapErrors = (errors: ValidationErrorItem[]): ValidationErrors => {
        const mappedErrors: ValidationErrors = {};

        errors.forEach((error) => {
            const path = error.path.join(".");
            const message = error.message;
            
            mappedErrors[path] = message;
        });

        return mappedErrors;
    }
    
    static throwValidationError = (errors: ValidationErrorItem[]): never => {
        const mappedErrors = this.mapErrors(errors);

        throw new ValidationException(VALIDATION_REQUEST_FAILED, mappedErrors);
    }
}