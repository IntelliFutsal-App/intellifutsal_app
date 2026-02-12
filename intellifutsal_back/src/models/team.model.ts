import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";


@Entity({ name: "teams" })
@Unique(["name"])
export class Team extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100, unique: true, nullable: false })
    name!: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    category!: string;

    @Column({ type: "boolean", default: true, nullable: false })
    status!: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz", nullable: true, onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt?: Date;
}