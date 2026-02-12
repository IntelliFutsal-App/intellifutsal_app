import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Credential } from ".";


@Entity({ name: "refresh_tokens" })
export class RefreshToken extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Credential, (credential) => credential.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "credentials_id" })
    credential!: Credential;

    @Column({ type: "varchar", length: 500, nullable: false })
    token!: string;

    @Column({ name: "expires_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    expiresAt!: Date;

    @Column({ type: "boolean", default: false })
    revoked!: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt!: Date;
}