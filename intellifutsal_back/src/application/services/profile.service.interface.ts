import { ProfileStateResponse } from '../../domain/interfaces';


export interface IProfileService {
    getMyState(credentialId: number): Promise<ProfileStateResponse>;
}