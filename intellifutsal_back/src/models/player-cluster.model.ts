import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Cluster, Player } from ".";


@Entity({ name: "player_clusters" })
@Unique(["player", "cluster"]) 
export class PlayerCluster extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz", nullable: true, onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt?: Date;

    @ManyToOne(() => Player, (player) => player.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "players_id" })
    player!: Player;

    @ManyToOne(() => Cluster, (cluster) => cluster.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "clusters_id" })
    cluster!: Cluster;
}