export class TeamResponse {
    id!: number;
    name!: string;
    category!: string;
    playerCount!: number;
    averageAge!: number;
    status!: boolean;
    createdAt!: Date;
    updatedAt?: Date | null;
}