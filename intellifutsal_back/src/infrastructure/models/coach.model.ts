import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Credential } from ".";


@Entity({ name: "coaches" })
export class Coach extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "first_name", type: "varchar", length: 100, nullable: false })
    firstName!: string;

    @Column({ name: "last_name", type: "varchar", length: 100, nullable: false })
    lastName!: string;

    @Column({ name: "birth_date", type: "date", nullable: false })
    birthDate!: Date;

    @Column({ name: "exp_years", type: "decimal", precision: 5, scale: 2, nullable: false, default: 0 })
    expYears!: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    specialty!: string;

    @Column({ type: "boolean", default: true, nullable: false })
    status!: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz", nullable: true, onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt?: Date;

    @OneToOne(() => Credential, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "credentials_id", referencedColumnName: "id" })
    credential!: Credential;
}