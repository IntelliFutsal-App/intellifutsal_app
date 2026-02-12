import type { Role } from "./role";
import type { User } from "./user";

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, role: Role) => Promise<void>;
    logout: () => Promise<void>;
    hasRole: (roles: Role | Role[]) => boolean;
    updateUser: (user: User) => void;
}