import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Coach, Team } from ".";


@Entity({ name: "coach_teams" })
@Unique(["coach", "team"]) 
export class CoachTeam extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ name: "assignment_date", type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    assignmentDate!: Date;

    @Column({ name: "end_date", type: "timestamptz", nullable: true })
    endDate?: Date;

    @Column({ type: "boolean", default: true, nullable: false })
    status!: boolean;

    @ManyToOne(() => Coach, (coach) => coach.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "coaches_id" }) 
    coach!: Coach;

    @ManyToOne(() => Team, (team) => team.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "teams_id" }) 
    team!: Team;
}