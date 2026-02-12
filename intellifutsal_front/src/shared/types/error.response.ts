/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ErrorResponse {
    status: string;
    message: string;
    code: number;
    details?: any;
}