export class ValidationException extends Error {
    public readonly details: any;
    
    constructor(message: string, details: any) {
        super(message);
        this.name = "ValidationException";
        this.details = details;
    }
}