import { ProfileStateResponse } from "../interfaces";


export interface IProfileService {
    getMyState(credentialId: number): Promise<ProfileStateResponse>;
}