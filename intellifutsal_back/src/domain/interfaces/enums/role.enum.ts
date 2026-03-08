export enum Role {
    PLAYER = "PLAYER",
    COACH = "COACH",
    ADMIN = "ADMIN"
}

export const stringToRole = (value: string): Role => {
    const upperValue = value.toUpperCase();
    if (upperValue in Role) return Role[upperValue as keyof typeof Role];
    
    const role = Object.values(Role).find(role => role === upperValue);
    if (role) return role;

    throw new Error(`Invalid role: ${value}. Valid roles are: ${Object.values(Role).join(", ")}`);
}