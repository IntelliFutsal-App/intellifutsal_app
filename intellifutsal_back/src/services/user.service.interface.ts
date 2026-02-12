import { UserResponse, UpdateUserRequest, CreateUserRequest, UpdateStatusRequest, CoachResponse, PlayerResponse } from "../interfaces";


export interface IUserService {
    findAll(): Promise<UserResponse[]>;
    findAllIncludingInactive(): Promise<UserResponse[]>;
    findById(id: number): Promise<UserResponse>;
    findByIdIncludingInactive(id: number): Promise<UserResponse>;
    findByEmail(email: string): Promise<UserResponse>;
    findRoleEntityById(id: number): Promise<CoachResponse | PlayerResponse>;
    save(createUserRequest: CreateUserRequest): Promise<UserResponse>;
    update(updateUserRequest: UpdateUserRequest): Promise<UserResponse>;
    delete(id: number): Promise<void>;
    updateStatus(id: number, updateStatusRequest: UpdateStatusRequest): Promise<UserResponse>;
}