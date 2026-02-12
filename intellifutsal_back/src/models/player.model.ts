import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Position } from "../interfaces";
import { Credential } from ".";


@Entity({ name: "players" })
export class Player extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "first_name", type: "varchar", length: 100, nullable: false })
    firstName!: string;

    @Column({ name: "last_name", type: "varchar", length: 100, nullable: false })
    lastName!: string;

    @Column({ name: "birth_date", type: "date", nullable: false })
    birthDate!: Date;

    @Column({ type: "decimal", precision: 4, scale: 2, nullable: false })
    height!: number; 

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: false })   
    weight!: number; 

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: false })
    bmi!: number; 

    @Column({ name: "high_jump", type: "decimal", precision: 4, scale: 2, nullable: true })
    highJump!: number; 

    @Column({ name: "right_unipodal_jump", type: "decimal", precision: 4, scale: 2, nullable: true })
    rightUnipodalJump!: number; 

    @Column({ name: "left_unipodal_jump", type: "decimal", precision: 4, scale: 2, nullable: true })
    leftUnipodalJump!: number; 

    @Column({ name: "bipodal_jump", type: "decimal", precision: 4, scale: 2, nullable: true })
    bipodalJump!: number; 

    @Column({ name: "thirty_meters_time", type: "decimal", precision: 6, scale: 2, nullable: true })
    thirtyMetersTime!: number; 

    @Column({ name: "thousand_meters_time", type: "decimal", precision: 6, scale: 2, nullable: true })
    thousandMetersTime!: number; 

    @Column({ type: "enum", enum: Position, nullable: false })
    position!: Position;

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