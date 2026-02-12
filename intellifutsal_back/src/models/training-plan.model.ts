import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Coach, Cluster } from ".";
import { TrainingPlanStatus } from "../interfaces";


@Entity({ name: "training_plans" })
export class TrainingPlan extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    title!: string;

    @Column({ type: "text", nullable: false })
    description!: string;

    @Column({ name: "generated_by_ai", type: "boolean", default: true })
    generatedByAi!: boolean;

    @Column({ name: "difficulty", type: "varchar", length: 50, nullable: true })
    difficulty?: string;

    @Column({ name: "duration_minutes", type: "int", nullable: true })
    durationMinutes?: number;

    @Column({ name: "focus_area", type: "varchar", length: 100, nullable: true })
    focusArea?: string;

    @Column({ type: "enum", enum: TrainingPlanStatus, default: TrainingPlanStatus.PENDING_APPROVAL })
    status!: TrainingPlanStatus;

    @Column({ name: "approval_comment", type: "text", nullable: true })
    approvalComment?: string;

    @Column({ name: "approved_at", type: "timestamptz", nullable: true })
    approvedAt?: Date;

    @Column({ name: "rejected_at", type: "timestamptz", nullable: true })
    rejectedAt?: Date;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz", nullable: true, onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt?: Date;

    @ManyToOne(() => Cluster, (cluster) => cluster.id, { onDelete: "SET NULL", eager: false, nullable: true })
    @JoinColumn({ name: "clusters_id" })
    cluster?: Cluster;

    @ManyToOne(() => Coach, (coach) => coach.id, { onDelete: "SET NULL", eager: true, nullable: true })
    @JoinColumn({ name: "created_by_coach_id" })
    createdByCoach?: Coach;
}