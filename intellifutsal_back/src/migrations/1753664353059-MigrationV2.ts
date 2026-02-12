import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV21753664353059 implements MigrationInterface {
    name = 'MigrationV21753664353059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coach_teams" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "coaches" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "credentials" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "credentials" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "player_teams" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "players" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "status" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "players" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "player_teams" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "credentials" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "credentials" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "coaches" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "coach_teams" DROP COLUMN "status"`);
    }

}
