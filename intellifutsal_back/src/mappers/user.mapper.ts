import { CreateUserRequest, UpdateUserRequest, UserResponse } from "../interfaces";
import { Credential } from "../models";
import { stringToRole } from '../interfaces/enums/role.enum';


export class UserMapper {
    static toResponse = (credential: Credential): UserResponse => {
        const userResponse = new UserResponse();

        userResponse.id = credential.id;
        userResponse.email = credential.email;
        userResponse.role = credential.role.toString();
        userResponse.onboardingStatus = credential.onboardingStatus.toString();
        userResponse.status = credential.status;
        userResponse.createdAt = credential.createdAt;
        if (credential.updatedAt) userResponse.updatedAt = credential.updatedAt;

        return userResponse;
    }

    static toResponseList = (credentials: Credential[]): UserResponse[] => {
        return credentials.map(this.toResponse);
    }

    static toEntity = (createUserRequest: CreateUserRequest, passwordHashed: string): Credential => {
        const credential = new Credential();

        credential.email = createUserRequest.email;
        credential.password = passwordHashed;
        credential.role = stringToRole(createUserRequest.role);

        return credential;
    }

    static toEntityUpdate = (updateUserRequest: UpdateUserRequest, passwordHashed?: string): Credential => {
        const credential = new Credential();

        credential.id = updateUserRequest.id;
        
        if (updateUserRequest.email) credential.email = updateUserRequest.email;
        if (passwordHashed) credential.password = passwordHashed;

        return credential;
    }
}