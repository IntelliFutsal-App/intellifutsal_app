import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { OnboardingStatus, Role } from "../interfaces";


@Entity({ name: "credentials" })
@Unique(["email"])
export class Credential extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 150, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @Column({ type: "enum", enum: Role, default: Role.PLAYER })
    role!: Role;

    @Column({ type: "enum", enum: OnboardingStatus, default: OnboardingStatus.REGISTERED })
    onboardingStatus!: OnboardingStatus;

    @Column({ type: "boolean", default: true, nullable: false })
    status!: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz", nullable: true, onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt?: Date;
}
