import { Role } from "../enums";


export class RegisterUserRequest {
    email!: string;
    password!: string;
    role!: Role;
}