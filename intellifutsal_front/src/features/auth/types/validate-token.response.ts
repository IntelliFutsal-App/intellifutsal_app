import type { JwtPayload } from "./jwt-payload";

export interface ValidateTokenResponse {
    isValid: boolean;
    payload: JwtPayload;
}