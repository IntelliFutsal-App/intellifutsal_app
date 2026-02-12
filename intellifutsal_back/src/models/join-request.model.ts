import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from "typeorm";
import { Player, Team, Coach } from ".";
import { JoinRequestStatus } from "../interfaces";


@Entity({ name: "join_requests" })
@Unique(["player", "team", "status"])
export class JoinRequest extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "enum", enum: JoinRequestStatus, default: JoinRequestStatus.PENDING })
    status!: JoinRequestStatus;

    @Column({ name: "review_comment", type: "text", nullable: true })
    reviewComment?: string;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    createdAt!: Date;

    @Column({ name: "reviewed_at", type: "timestamptz", nullable: true })
    reviewedAt?: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz", nullable: true, onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt?: Date;

    @ManyToOne(() => Player, (player) => player.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "players_id" })
    player!: Player;

    @ManyToOne(() => Team, (team) => team.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "teams_id" })
    team!: Team;

    @ManyToOne(() => Coach, (coach) => coach.id, { onDelete: "SET NULL", eager: true, nullable: true })
    @JoinColumn({ name: "coaches_id" })
    coach?: Coach;
}