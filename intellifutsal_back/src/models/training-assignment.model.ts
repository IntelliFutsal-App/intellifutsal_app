import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TrainingPlan, Player, Team, Coach } from ".";
import { TrainingAssignmentStatus } from "../interfaces";


@Entity({ name: "training_assignments" })
export class TrainingAssignment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => TrainingPlan, (plan) => plan.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "training_plan_id" })
    trainingPlan!: TrainingPlan;

    @ManyToOne(() => Player, (player) => player.id, { onDelete: "CASCADE", eager: true, nullable: true })
    @JoinColumn({ name: "players_id" })
    player?: Player;

    @ManyToOne(() => Team, (team) => team.id, { onDelete: "CASCADE", eager: true, nullable: true })
    @JoinColumn({ name: "teams_id" })
    team?: Team;

    @ManyToOne(() => Coach, (coach) => coach.id, { onDelete: "SET NULL", eager: true, nullable: true })
    @JoinColumn({ name: "assigned_by_coach_id" })
    assignedByCoach?: Coach;

    @Column({ type: "enum", enum: TrainingAssignmentStatus, default: TrainingAssignmentStatus.PENDING })
    status!: TrainingAssignmentStatus;

    @Column({ name: "start_date", type: "timestamptz", nullable: true })
    startDate?: Date;

    @Column({ name: "end_date", type: "timestamptz", nullable: true })
    endDate?: Date;

    @Column({ name: "approved_at", type: "timestamptz", nullable: true })
    approvedAt?: Date;

    @Column({ name: "cancelled_at", type: "timestamptz", nullable: true })
    cancelledAt?: Date;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz", nullable: true, onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt?: Date;
}