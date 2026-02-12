import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Player, Team } from ".";


@Entity({ name: "player_teams" })
@Unique(["player", "team"])
export class PlayerTeam extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ name: "entry_date", type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    entryDate!: Date;

    @Column({ name: "exit_date", type: "timestamptz", nullable: true })
    exitDate?: Date;

    @Column({ type: "boolean", default: true, nullable: false })
    status!: boolean;

    @ManyToOne(() => Player, (player) => player.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "players_id" }) 
    player!: Player;

    @ManyToOne(() => Team, (team) => team.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "teams_id" }) 
    team!: Team;
}