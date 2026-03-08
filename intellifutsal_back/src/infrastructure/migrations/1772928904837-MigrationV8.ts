import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV81772928904837 implements MigrationInterface {
    name = 'MigrationV81772928904837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."credentials_onboardingstatus_enum" RENAME TO "credentials_onboardingstatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."credentials_onboardingstatus_enum" AS ENUM('REGISTERED', 'PROFILE_CREATED', 'PROFILE_INCOMPLETE', 'TEAM_PENDING', 'COACH_PENDING_APPROVAL', 'ACTIVE')`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "onboardingStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "onboardingStatus" TYPE "public"."credentials_onboardingstatus_enum" USING "onboardingStatus"::"text"::"public"."credentials_onboardingstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "onboardingStatus" SET DEFAULT 'REGISTERED'`);
        await queryRunner.query(`DROP TYPE "public"."credentials_onboardingstatus_enum_old"`);
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "height" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "weight" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "bmi" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "position" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "position" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "bmi" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "weight" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "height" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."credentials_onboardingstatus_enum_old" AS ENUM('REGISTERED', 'PROFILE_CREATED', 'TEAM_PENDING', 'COACH_PENDING_APPROVAL', 'ACTIVE')`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "onboardingStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "onboardingStatus" TYPE "public"."credentials_onboardingstatus_enum_old" USING "onboardingStatus"::"text"::"public"."credentials_onboardingstatus_enum_old"`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "onboardingStatus" SET DEFAULT 'REGISTERED'`);
        await queryRunner.query(`DROP TYPE "public"."credentials_onboardingstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."credentials_onboardingstatus_enum_old" RENAME TO "credentials_onboardingstatus_enum"`);
    }

}
