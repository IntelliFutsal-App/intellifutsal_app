import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV71771810995805 implements MigrationInterface {
    name = 'MigrationV71771810995805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."credentials_onboardingstatus_enum" RENAME TO "credentials_onboardingstatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."credentials_onboardingstatus_enum" AS ENUM('REGISTERED', 'PROFILE_CREATED', 'TEAM_PENDING', 'COACH_PENDING_APPROVAL', 'ACTIVE')`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "onboardingStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "onboardingStatus" TYPE "public"."credentials_onboardingstatus_enum" USING "onboardingStatus"::"text"::"public"."credentials_onboardingstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "onboardingStatus" SET DEFAULT 'REGISTERED'`);
        await queryRunner.query(`DROP TYPE "public"."credentials_onboardingstatus_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."credentials_onboardingstatus_enum_old" AS ENUM('REGISTERED', 'PROFILE_CREATED', 'TEAM_PENDING', 'ACTIVE')`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "onboardingStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "onboardingStatus" TYPE "public"."credentials_onboardingstatus_enum_old" USING "onboardingStatus"::"text"::"public"."credentials_onboardingstatus_enum_old"`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "onboardingStatus" SET DEFAULT 'REGISTERED'`);
        await queryRunner.query(`DROP TYPE "public"."credentials_onboardingstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."credentials_onboardingstatus_enum_old" RENAME TO "credentials_onboardingstatus_enum"`);
    }

}
