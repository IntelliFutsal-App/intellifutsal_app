import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationV31764354342129 implements MigrationInterface {
    name = 'MigrationV31764354342129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."join_requests_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "join_requests" ("id" SERIAL NOT NULL, "status" "public"."join_requests_status_enum" NOT NULL DEFAULT 'PENDING', "review_comment" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "reviewed_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "players_id" integer, "teams_id" integer, "coaches_id" integer, CONSTRAINT "UQ_5416a8d9ec03b4658e0c8fdb1e8" UNIQUE ("players_id", "teams_id", "status"), CONSTRAINT "PK_3584a09620923a5aaf7de782f0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."training_assignments_status_enum" AS ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "training_assignments" ("id" SERIAL NOT NULL, "status" "public"."training_assignments_status_enum" NOT NULL DEFAULT 'PENDING', "start_date" date, "end_date" date, "approved_at" TIMESTAMP, "cancelled_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "training_plan_id" integer, "players_id" integer, "teams_id" integer, "assigned_by_coach_id" integer, CONSTRAINT "PK_c05e77c7a449a96eb76160a98f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."training_plans_status_enum" AS ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ARCHIVED')`);
        await queryRunner.query(`CREATE TABLE "training_plans" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" text NOT NULL, "generated_by_ai" boolean NOT NULL DEFAULT true, "difficulty" character varying(50), "duration_minutes" integer, "focus_area" character varying(100), "status" "public"."training_plans_status_enum" NOT NULL DEFAULT 'PENDING_APPROVAL', "approval_comment" text, "approved_at" TIMESTAMP, "rejected_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_coach_id" integer, "clusters_id" integer, CONSTRAINT "PK_246975cb895b51662b90515a390" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "training_progress" ("id" SERIAL NOT NULL, "progress_date" date NOT NULL, "completion_percentage" integer NOT NULL, "notes" text, "coach_verified" boolean NOT NULL DEFAULT false, "verified_at" TIMESTAMP, "verification_comment" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "training_assignment_id" integer, "recorded_by_player_id" integer, "recorded_by_coach_id" integer, CONSTRAINT "PK_97c9d74dd8beeffd749a90e411b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "join_requests" ADD CONSTRAINT "FK_b90cbbecdf6963d6e6f3b485ac5" FOREIGN KEY ("players_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_requests" ADD CONSTRAINT "FK_bd98c49ccfcd87d4e653d256bfe" FOREIGN KEY ("teams_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_requests" ADD CONSTRAINT "FK_bafbc220d60c35fbeff3bd409e4" FOREIGN KEY ("coaches_id") REFERENCES "coaches"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_assignments" ADD CONSTRAINT "FK_e65a401e7bf14d84b246fe550e6" FOREIGN KEY ("training_plan_id") REFERENCES "training_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_assignments" ADD CONSTRAINT "FK_e8d5e62d7c2ef3d107f96bcbb05" FOREIGN KEY ("players_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_assignments" ADD CONSTRAINT "FK_d593da100ced00abcffe9576ca8" FOREIGN KEY ("teams_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_assignments" ADD CONSTRAINT "FK_a2395e43d565143929965d8a08a" FOREIGN KEY ("assigned_by_coach_id") REFERENCES "coaches"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_plans" ADD CONSTRAINT "FK_19991edd64daceec2844b014d44" FOREIGN KEY ("created_by_coach_id") REFERENCES "coaches"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_plans" ADD CONSTRAINT "FK_4fe1780b21714d7120513d7b24c" FOREIGN KEY ("clusters_id") REFERENCES "clusters"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_progress" ADD CONSTRAINT "FK_b25d425202d361a69ba791d00c8" FOREIGN KEY ("training_assignment_id") REFERENCES "training_assignments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_progress" ADD CONSTRAINT "FK_2878dcf633823ed69e393b54b81" FOREIGN KEY ("recorded_by_player_id") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_progress" ADD CONSTRAINT "FK_e32549ae486def3e2f59913ae7b" FOREIGN KEY ("recorded_by_coach_id") REFERENCES "coaches"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "training_progress" DROP CONSTRAINT "FK_e32549ae486def3e2f59913ae7b"`);
        await queryRunner.query(`ALTER TABLE "training_progress" DROP CONSTRAINT "FK_2878dcf633823ed69e393b54b81"`);
        await queryRunner.query(`ALTER TABLE "training_progress" DROP CONSTRAINT "FK_b25d425202d361a69ba791d00c8"`);
        await queryRunner.query(`ALTER TABLE "training_plans" DROP CONSTRAINT "FK_4fe1780b21714d7120513d7b24c"`);
        await queryRunner.query(`ALTER TABLE "training_plans" DROP CONSTRAINT "FK_19991edd64daceec2844b014d44"`);
        await queryRunner.query(`ALTER TABLE "training_assignments" DROP CONSTRAINT "FK_a2395e43d565143929965d8a08a"`);
        await queryRunner.query(`ALTER TABLE "training_assignments" DROP CONSTRAINT "FK_d593da100ced00abcffe9576ca8"`);
        await queryRunner.query(`ALTER TABLE "training_assignments" DROP CONSTRAINT "FK_e8d5e62d7c2ef3d107f96bcbb05"`);
        await queryRunner.query(`ALTER TABLE "training_assignments" DROP CONSTRAINT "FK_e65a401e7bf14d84b246fe550e6"`);
        await queryRunner.query(`ALTER TABLE "join_requests" DROP CONSTRAINT "FK_bafbc220d60c35fbeff3bd409e4"`);
        await queryRunner.query(`ALTER TABLE "join_requests" DROP CONSTRAINT "FK_bd98c49ccfcd87d4e653d256bfe"`);
        await queryRunner.query(`ALTER TABLE "join_requests" DROP CONSTRAINT "FK_b90cbbecdf6963d6e6f3b485ac5"`);
        await queryRunner.query(`DROP TABLE "training_progress"`);
        await queryRunner.query(`DROP TABLE "training_plans"`);
        await queryRunner.query(`DROP TYPE "public"."training_plans_status_enum"`);
        await queryRunner.query(`DROP TABLE "training_assignments"`);
        await queryRunner.query(`DROP TYPE "public"."training_assignments_status_enum"`);
        await queryRunner.query(`DROP TABLE "join_requests"`);
        await queryRunner.query(`DROP TYPE "public"."join_requests_status_enum"`);
    }

}
