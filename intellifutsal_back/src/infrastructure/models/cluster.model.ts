import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "clusters" })
export class Cluster extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text", nullable: false })
    description!: string;

    @CreateDateColumn({ name: "creation_date", type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    creationDate!: Date;
}