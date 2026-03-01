import type { UserResponse } from "../types";

export const normalizeUserDates = (u: UserResponse): UserResponse => ({
    ...u,
    createdAt: new Date(u.createdAt),
    updatedAt: u.updatedAt ? new Date(u.updatedAt) : u.updatedAt,
});