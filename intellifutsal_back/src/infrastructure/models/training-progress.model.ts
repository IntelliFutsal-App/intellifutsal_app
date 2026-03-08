import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TrainingAssignment, Player, Coach } from ".";


@Entity({ name: "training_progress" })
export class TrainingProgress extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "progress_date", type: "date", nullable: false })
    progressDate!: Date;

    @Column({ name: "completion_percentage", type: "int", nullable: false })
    completionPercentage!: number;

    @Column({ type: "text", nullable: true })
    notes?: string;

    @Column({ name: "coach_verified", type: "boolean", default: false })
    coachVerified!: boolean;

    @Column({ name: "verified_at", type: "timestamptz", nullable: true })
    verifiedAt?: Date;

    @Column({ name: "verification_comment", type: "text", nullable: true })
    verificationComment?: string;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz", nullable: true, onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt?: Date;

    @ManyToOne( () => TrainingAssignment, (assignment) => assignment.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "training_assignment_id" })
    trainingAssignment!: TrainingAssignment;

    @ManyToOne(() => Player, (player) => player.id, { onDelete: "SET NULL", eager: true, nullable: true })
    @JoinColumn({ name: "recorded_by_player_id" })
    recordedByPlayer?: Player;

    @ManyToOne(() => Coach, (coach) => coach.id, { onDelete: "SET NULL", eager: true, nullable: true })
    @JoinColumn({ name: "recorded_by_coach_id" })
    recordedByCoach?: Coach;
}