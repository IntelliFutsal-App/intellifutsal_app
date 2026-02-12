import type { Category } from "./category";

export interface TeamResponse {
    id: number;
    name: string;
    category: Category;
    playerCount: number;
    averageAge: number;
    status: boolean;
    createdAt: Date;
    updatedAt?: Date | null;
}