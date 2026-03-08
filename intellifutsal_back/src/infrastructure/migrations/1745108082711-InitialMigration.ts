import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1745108082711 implements MigrationInterface {
    name = 'InitialMigration1745108082711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clusters" ("id" SERIAL NOT NULL, "description" text NOT NULL, "creation_date" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_56c8e201f375e1e961dcdd6831c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coach_teams" ("id" SERIAL NOT NULL, "assignment_date" date NOT NULL DEFAULT ('now'::text)::date, "end_date" date, "coaches_id" integer, "teams_id" integer, CONSTRAINT "UQ_10924594f03c0658c429784dde7" UNIQUE ("coaches_id", "teams_id"), CONSTRAINT "PK_43798c1e7b56bc6b10660739d65" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coaches" ("id" SERIAL NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "birth_date" date NOT NULL, "exp_years" numeric(5,2) NOT NULL DEFAULT '0', "specialty" character varying(100) NOT NULL, "credentials_id" integer, CONSTRAINT "REL_5f0f42938eaed4a6f389e24819" UNIQUE ("credentials_id"), CONSTRAINT "PK_eddaece1a1f1b197fa39e6864a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."credentials_role_enum" AS ENUM('PLAYER', 'COACH')`);
        await queryRunner.query(`CREATE TABLE "credentials" ("id" SERIAL NOT NULL, "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."credentials_role_enum" NOT NULL DEFAULT 'PLAYER', CONSTRAINT "UQ_c286aa8e09ecff5cc756ee83214" UNIQUE ("email"), CONSTRAINT "PK_1e38bc43be6697cdda548ad27a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player_clusters" ("id" SERIAL NOT NULL, "players_id" integer, "clusters_id" integer, CONSTRAINT "UQ_f0ed116b763dcc742c66a0b137f" UNIQUE ("players_id", "clusters_id"), CONSTRAINT "PK_ccc7e4a2444502790521ddd42d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player_teams" ("id" SERIAL NOT NULL, "entry_date" date NOT NULL, "exit_date" date, "players_id" integer, "teams_id" integer, CONSTRAINT "UQ_bbbc070a3b8cb4f4c8db775bf49" UNIQUE ("players_id", "teams_id"), CONSTRAINT "PK_e5590318e146470273cc6fa9b59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."players_position_enum" AS ENUM('GOALKEEPER', 'FIXO', 'WINGER', 'PIVOT')`);
        await queryRunner.query(`CREATE TABLE "players" ("id" SERIAL NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "birth_date" date NOT NULL, "height" numeric(4,2) NOT NULL, "weight" numeric(5,2) NOT NULL, "bmi" numeric(5,2) NOT NULL, "high_jump" numeric(4,2), "right_unipodal_jump" numeric(4,2), "left_unipodal_jump" numeric(4,2), "bipodal_jump" numeric(4,2), "thirty_meters_time" numeric(6,2), "thousand_meters_time" numeric(6,2), "position" "public"."players_position_enum" NOT NULL, "credentials_id" integer, CONSTRAINT "REL_16fbb79bf3b1614f717c8748e7" UNIQUE ("credentials_id"), CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teams" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "category" character varying(50) NOT NULL, CONSTRAINT "UQ_48c0c32e6247a2de155baeaf980" UNIQUE ("name"), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "coach_teams" ADD CONSTRAINT "FK_92b9acbffbb4238703e8f677b9b" FOREIGN KEY ("coaches_id") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coach_teams" ADD CONSTRAINT "FK_e194b8df843692eeb19c31ca943" FOREIGN KEY ("teams_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coaches" ADD CONSTRAINT "FK_5f0f42938eaed4a6f389e248193" FOREIGN KEY ("credentials_id") REFERENCES "credentials"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_clusters" ADD CONSTRAINT "FK_e681922025a4a78f930e1037108" FOREIGN KEY ("players_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_clusters" ADD CONSTRAINT "FK_7112a4a1451b2b223ded5bee51d" FOREIGN KEY ("clusters_id") REFERENCES "clusters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_teams" ADD CONSTRAINT "FK_743486d990fdaf79891c9fe6cbd" FOREIGN KEY ("players_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_teams" ADD CONSTRAINT "FK_1285ccd0933e3b471634b5716ad" FOREIGN KEY ("teams_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "players" ADD CONSTRAINT "FK_16fbb79bf3b1614f717c8748e78" FOREIGN KEY ("credentials_id") REFERENCES "credentials"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "players" DROP CONSTRAINT "FK_16fbb79bf3b1614f717c8748e78"`);
        await queryRunner.query(`ALTER TABLE "player_teams" DROP CONSTRAINT "FK_1285ccd0933e3b471634b5716ad"`);
        await queryRunner.query(`ALTER TABLE "player_teams" DROP CONSTRAINT "FK_743486d990fdaf79891c9fe6cbd"`);
        await queryRunner.query(`ALTER TABLE "player_clusters" DROP CONSTRAINT "FK_7112a4a1451b2b223ded5bee51d"`);
        await queryRunner.query(`ALTER TABLE "player_clusters" DROP CONSTRAINT "FK_e681922025a4a78f930e1037108"`);
        await queryRunner.query(`ALTER TABLE "coaches" DROP CONSTRAINT "FK_5f0f42938eaed4a6f389e248193"`);
        await queryRunner.query(`ALTER TABLE "coach_teams" DROP CONSTRAINT "FK_e194b8df843692eeb19c31ca943"`);
        await queryRunner.query(`ALTER TABLE "coach_teams" DROP CONSTRAINT "FK_92b9acbffbb4238703e8f677b9b"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "players"`);
        await queryRunner.query(`DROP TYPE "public"."players_position_enum"`);
        await queryRunner.query(`DROP TABLE "player_teams"`);
        await queryRunner.query(`DROP TABLE "player_clusters"`);
        await queryRunner.query(`DROP TABLE "credentials"`);
        await queryRunner.query(`DROP TYPE "public"."credentials_role_enum"`);
        await queryRunner.query(`DROP TABLE "coaches"`);
        await queryRunner.query(`DROP TABLE "coach_teams"`);
        await queryRunner.query(`DROP TABLE "clusters"`);
    }

}
