import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV51766880697157 implements MigrationInterface {
    name = 'MigrationV51766880697157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."credentials_onboardingstatus_enum" AS ENUM('REGISTERED', 'PROFILE_CREATED', 'TEAM_PENDING', 'ACTIVE')`);
        await queryRunner.query(`ALTER TABLE "credentials" ADD "onboardingStatus" "public"."credentials_onboardingstatus_enum" NOT NULL DEFAULT 'REGISTERED'`);
        await queryRunner.query(`ALTER TYPE "public"."credentials_role_enum" RENAME TO "credentials_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."credentials_role_enum" AS ENUM('PLAYER', 'COACH', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "role" TYPE "public"."credentials_role_enum" USING "role"::"text"::"public"."credentials_role_enum"`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "role" SET DEFAULT 'PLAYER'`);
        await queryRunner.query(`DROP TYPE "public"."credentials_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."credentials_role_enum_old" AS ENUM('PLAYER', 'COACH')`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "role" TYPE "public"."credentials_role_enum_old" USING "role"::"text"::"public"."credentials_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "role" SET DEFAULT 'PLAYER'`);
        await queryRunner.query(`DROP TYPE "public"."credentials_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."credentials_role_enum_old" RENAME TO "credentials_role_enum"`);
        await queryRunner.query(`ALTER TABLE "credentials" DROP COLUMN "onboardingStatus"`);
        await queryRunner.query(`DROP TYPE "public"."credentials_onboardingstatus_enum"`);
    }

}
