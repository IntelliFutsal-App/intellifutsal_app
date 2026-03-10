--
-- PostgreSQL database restore for intellifutsal_db
-- Adapted from dump-intellifutsal_db-202603081806.sql
-- This script runs automatically on first docker-compose up (empty volume only)
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Custom ENUM types
--

CREATE TYPE public.credentials_onboardingstatus_enum AS ENUM (
    'REGISTERED',
    'PROFILE_CREATED',
    'PROFILE_INCOMPLETE',
    'TEAM_PENDING',
    'COACH_PENDING_APPROVAL',
    'ACTIVE'
);

CREATE TYPE public.credentials_role_enum AS ENUM (
    'PLAYER',
    'COACH',
    'ADMIN'
);

CREATE TYPE public.join_requests_status_enum AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);

CREATE TYPE public.players_position_enum AS ENUM (
    'GOALKEEPER',
    'FIXO',
    'WINGER',
    'PIVOT'
);

CREATE TYPE public.training_assignments_status_enum AS ENUM (
    'PENDING',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE public.training_plans_status_enum AS ENUM (
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'REJECTED',
    'ARCHIVED'
);

SET default_tablespace = '';
SET default_table_access_method = heap;

--
-- Tables
--

CREATE TABLE public.clusters (
    id integer NOT NULL,
    description text NOT NULL,
    creation_date timestamp with time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.clusters_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.clusters_id_seq OWNED BY public.clusters.id;

CREATE TABLE public.coach_teams (
    id integer NOT NULL,
    coaches_id integer,
    teams_id integer,
    status boolean DEFAULT true NOT NULL,
    assignment_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone
);

CREATE SEQUENCE public.coach_teams_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.coach_teams_id_seq OWNED BY public.coach_teams.id;

CREATE TABLE public.coaches (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    birth_date date NOT NULL,
    exp_years numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    specialty character varying(100) NOT NULL,
    credentials_id integer,
    status boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE public.coaches_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.coaches_id_seq OWNED BY public.coaches.id;

CREATE TABLE public.credentials (
    id integer NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role public.credentials_role_enum DEFAULT 'PLAYER'::public.credentials_role_enum NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "onboardingStatus" public.credentials_onboardingstatus_enum DEFAULT 'REGISTERED'::public.credentials_onboardingstatus_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE public.credentials_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.credentials_id_seq OWNED BY public.credentials.id;

CREATE TABLE public.join_requests (
    id integer NOT NULL,
    status public.join_requests_status_enum DEFAULT 'PENDING'::public.join_requests_status_enum NOT NULL,
    review_comment text,
    players_id integer,
    teams_id integer,
    coaches_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE public.join_requests_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.join_requests_id_seq OWNED BY public.join_requests.id;

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);

CREATE SEQUENCE public.migrations_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;

CREATE TABLE public.player_clusters (
    id integer NOT NULL,
    players_id integer,
    clusters_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE public.player_clusters_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.player_clusters_id_seq OWNED BY public.player_clusters.id;

CREATE TABLE public.player_teams (
    id integer NOT NULL,
    players_id integer,
    teams_id integer,
    status boolean DEFAULT true NOT NULL,
    entry_date timestamp with time zone DEFAULT now() NOT NULL,
    exit_date timestamp with time zone
);

CREATE SEQUENCE public.player_teams_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.player_teams_id_seq OWNED BY public.player_teams.id;

CREATE TABLE public.players (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    birth_date date NOT NULL,
    height numeric(4,2),
    weight numeric(5,2),
    bmi numeric(5,2),
    high_jump numeric(4,2),
    right_unipodal_jump numeric(4,2),
    left_unipodal_jump numeric(4,2),
    bipodal_jump numeric(4,2),
    thirty_meters_time numeric(6,2),
    thousand_meters_time numeric(6,2),
    "position" public.players_position_enum,
    credentials_id integer,
    status boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE public.players_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    token character varying(500) NOT NULL,
    revoked boolean DEFAULT false NOT NULL,
    credentials_id integer,
    expires_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    category character varying(50) NOT NULL,
    status boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE public.teams_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;

CREATE TABLE public.training_assignments (
    id integer NOT NULL,
    status public.training_assignments_status_enum DEFAULT 'PENDING'::public.training_assignments_status_enum NOT NULL,
    training_plan_id integer,
    players_id integer,
    teams_id integer,
    assigned_by_coach_id integer,
    updated_at timestamp with time zone DEFAULT now(),
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    approved_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.training_assignments_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.training_assignments_id_seq OWNED BY public.training_assignments.id;

CREATE TABLE public.training_plans (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    generated_by_ai boolean DEFAULT true NOT NULL,
    difficulty character varying(50),
    duration_minutes integer,
    focus_area character varying(100),
    status public.training_plans_status_enum DEFAULT 'PENDING_APPROVAL'::public.training_plans_status_enum NOT NULL,
    approval_comment text,
    created_by_coach_id integer,
    clusters_id integer,
    updated_at timestamp with time zone DEFAULT now(),
    approved_at timestamp with time zone,
    rejected_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.training_plans_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.training_plans_id_seq OWNED BY public.training_plans.id;

CREATE TABLE public.training_progress (
    id integer NOT NULL,
    progress_date date NOT NULL,
    completion_percentage integer NOT NULL,
    notes text,
    coach_verified boolean DEFAULT false NOT NULL,
    verification_comment text,
    training_assignment_id integer,
    recorded_by_player_id integer,
    recorded_by_coach_id integer,
    updated_at timestamp with time zone DEFAULT now(),
    verified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.training_progress_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.training_progress_id_seq OWNED BY public.training_progress.id;

--
-- Column defaults (sequences)
--

ALTER TABLE ONLY public.clusters ALTER COLUMN id SET DEFAULT nextval('public.clusters_id_seq'::regclass);
ALTER TABLE ONLY public.coach_teams ALTER COLUMN id SET DEFAULT nextval('public.coach_teams_id_seq'::regclass);
ALTER TABLE ONLY public.coaches ALTER COLUMN id SET DEFAULT nextval('public.coaches_id_seq'::regclass);
ALTER TABLE ONLY public.credentials ALTER COLUMN id SET DEFAULT nextval('public.credentials_id_seq'::regclass);
ALTER TABLE ONLY public.join_requests ALTER COLUMN id SET DEFAULT nextval('public.join_requests_id_seq'::regclass);
ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
ALTER TABLE ONLY public.player_clusters ALTER COLUMN id SET DEFAULT nextval('public.player_clusters_id_seq'::regclass);
ALTER TABLE ONLY public.player_teams ALTER COLUMN id SET DEFAULT nextval('public.player_teams_id_seq'::regclass);
ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);
ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);
ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);
ALTER TABLE ONLY public.training_assignments ALTER COLUMN id SET DEFAULT nextval('public.training_assignments_id_seq'::regclass);
ALTER TABLE ONLY public.training_plans ALTER COLUMN id SET DEFAULT nextval('public.training_plans_id_seq'::regclass);
ALTER TABLE ONLY public.training_progress ALTER COLUMN id SET DEFAULT nextval('public.training_progress_id_seq'::regclass);

--
-- Data: clusters
--

INSERT INTO public.clusters VALUES (1, 'Perfil para posición ''Ala''', '2026-03-02 02:19:25.529123+00');
INSERT INTO public.clusters VALUES (2, 'Perfil para posición ''Ala''', '2026-03-02 02:19:25.5478+00');
INSERT INTO public.clusters VALUES (3, 'Perfil para posición ''Pívot''', '2026-03-02 02:19:25.551392+00');
INSERT INTO public.clusters VALUES (4, 'Perfil para posición ''Ala''', '2026-03-02 02:19:25.55337+00');
INSERT INTO public.clusters VALUES (5, 'Jugador ágil con buen rendimiento general', '2026-03-02 02:19:25.563725+00');
INSERT INTO public.clusters VALUES (6, 'Jugador con mayor resistencia y menor explosividad', '2026-03-02 02:19:25.576487+00');
INSERT INTO public.clusters VALUES (7, 'Jugador con buen equilibrio físico general', '2026-03-02 02:19:25.581482+00');
INSERT INTO public.clusters VALUES (8, 'Jugador con buen equilibrio físico general', '2026-03-02 02:19:25.59387+00');
INSERT INTO public.clusters VALUES (9, 'Perfil para posición ''Pívot''', '2026-03-02 02:19:25.594161+00');
INSERT INTO public.clusters VALUES (10, 'Jugador ágil con buen rendimiento general', '2026-03-02 02:19:25.601252+00');
INSERT INTO public.clusters VALUES (11, 'Jugador ágil con buen rendimiento general', '2026-03-02 02:19:25.603348+00');
INSERT INTO public.clusters VALUES (12, 'Perfil para posición ''Ala''', '2026-03-02 02:19:25.608402+00');
INSERT INTO public.clusters VALUES (13, 'Perfil para posición ''Ala''', '2026-03-02 02:19:25.618587+00');
INSERT INTO public.clusters VALUES (14, 'Perfil para posición ''Arquero''', '2026-03-02 02:19:25.621263+00');
INSERT INTO public.clusters VALUES (15, 'Jugador con alta explosividad y capacidad de salto', '2026-03-02 02:19:25.625415+00');
INSERT INTO public.clusters VALUES (16, 'Perfil para posición ''Ala''', '2026-03-02 02:19:25.633847+00');
INSERT INTO public.clusters VALUES (17, 'Jugador ágil con buen rendimiento general', '2026-03-02 02:19:25.639601+00');
INSERT INTO public.clusters VALUES (18, 'Jugador con alta explosividad y capacidad de salto', '2026-03-02 02:19:25.64352+00');
INSERT INTO public.clusters VALUES (19, 'Jugador con mayor BMI y potencia física', '2026-03-02 02:19:25.642251+00');
INSERT INTO public.clusters VALUES (20, 'Perfil para posición ''Ala''', '2026-03-02 02:19:25.649327+00');

--
-- Data: coach_teams
--

INSERT INTO public.coach_teams VALUES (1, 1, 1, true, '2026-02-05 00:00:00+00', NULL);
INSERT INTO public.coach_teams VALUES (2, 1, 2, true, '2026-02-05 00:00:00+00', NULL);
INSERT INTO public.coach_teams VALUES (3, 1, 3, true, '2026-02-05 00:00:00+00', NULL);

--
-- Data: coaches
--

INSERT INTO public.coaches VALUES (1, 'Carlos', 'Ramírez', '1988-03-14', 12.00, 'Entrenamiento táctico y desarrollo físico en fútbol sala', 2, true, '2026-03-02 00:22:53.664059+00', '2026-03-02 00:22:53.664059+00');

--
-- Data: credentials
--

INSERT INTO public.credentials VALUES (10, 'samuel.padilla@gmail.com', '$2a$10$aCsHDpzvLWicCXdlsNK2TeggbF9VBx/t5WjoSx9t1D3Y1r0NQPlR2', 'PLAYER', true, 'ACTIVE', '2026-03-02 00:12:06.853914+00', '2026-03-02 01:36:03.453123+00');
INSERT INTO public.credentials VALUES (11, 'juan.henao@gmail.com', '$2a$10$WnSNX4z4OmCR1DOKaEWU0eQqhEenJy.e6K8nuKk140ZHzeEqer53K', 'PLAYER', true, 'ACTIVE', '2026-03-02 00:12:16.720364+00', '2026-03-02 01:37:04.986748+00');
INSERT INTO public.credentials VALUES (12, 'nicolas.bermudez@gmail.com', '$2a$10$SZ1lWRXukOwcTO.yTeOcCe2ipayTSaCPQf1TYKlNxwPhzUVjh68zu', 'PLAYER', true, 'ACTIVE', '2026-03-02 00:12:29.622074+00', '2026-03-02 01:37:32.369907+00');
INSERT INTO public.credentials VALUES (13, 'jose.gimenez@gmail.com', '$2a$10$1NDdWNeNgdLmKaSZ5ZLZC.mlHCFQbZ4tSIN7/3.Tr0xHVZBYIfT32', 'PLAYER', true, 'ACTIVE', '2026-03-02 00:12:52.902484+00', '2026-03-02 01:37:55.706973+00');
INSERT INTO public.credentials VALUES (2, 'coach@gmail.com', '$2a$10$13j0uS2bEHVQ.e7g2ePcL.ru0F3tHRmTFq9gJvFdjVZYKpz8MjOFi', 'COACH', true, 'ACTIVE', '2026-03-02 00:04:31.926155+00', '2026-03-02 01:32:46.909901+00');
INSERT INTO public.credentials VALUES (14, 'daniel.cuero@gmail.com', '$2a$10$I9MN54mfhr3zj8.9.T1U/u7uav.73wdaDooA.AV.YINX45/QkdcO6', 'PLAYER', true, 'ACTIVE', '2026-03-02 00:13:04.025288+00', '2026-03-02 01:38:14.324138+00');
INSERT INTO public.credentials VALUES (1, 'admin@gmail.com', '$2a$10$8UHbbyIqr38IVVcw46KQVugecGQAu2ZiCwyLRQXS49suUnlEpDcTa', 'ADMIN', true, 'ACTIVE', '2026-03-02 00:00:05.038692+00', '2026-03-02 00:00:05.038692+00');
INSERT INTO public.credentials VALUES (3, 'juan.fernando@gmail.com', '$2a$10$FhLqEFpyX6WfPdEypIYaTuB14VbOIbzKJkeqlXVeX.xUeJc8uW/KC', 'PLAYER', true, 'ACTIVE', '2026-03-02 00:05:17.241808+00', '2026-03-02 00:24:12.238955+00');
INSERT INTO public.credentials VALUES (4, 'sergio@gmail.com', '$2a$10$JKnJhEPbt3XuUOTSmrv4NuqPYCA6GQQMut07wGEaTuvRncmnIru.q', 'PLAYER', true, 'ACTIVE', '2026-03-02 00:06:41.761603+00', '2026-03-02 00:25:03.663769+00');
INSERT INTO public.credentials VALUES (5, 'axel.cabal@gmail.com', '$2a$10$TBkD18ZI1TvlRJN.o/zivuHBkhOSyTQWrFS..ugj8R1p8pxK0cj0.', 'PLAYER', true, 'ACTIVE', '2026-03-02 00:07:03.274444+00', '2026-03-02 01:35:43.542174+00');
INSERT INTO public.credentials VALUES (6, 'jean.carlos@gmail.com', '$2a$10$22m4BhebIcxaHKHp91Y/M.kMlX8epMp9rV.z.yFeeeFsHZ.wugSMu', 'PLAYER', true, 'ACTIVE', '2026-03-02 00:09:26.963017+00', '2026-03-02 01:35:46.486284+00');
INSERT INTO public.credentials VALUES (7, 'jacobo.salazar@gmail.com', '$2a$10$mRUMRUHMMlJkqkgHiDgrsuBK4JSX9sYr/Ler5Ma0JCfPFqKxer7Bm', 'PLAYER', true, 'ACTIVE', '2026-03-02 00:09:56.323272+00', '2026-03-02 01:35:49.800049+00');
INSERT INTO public.credentials VALUES (8, 'oscar.salazar@gmail.com', '$2a$10$lENqmLqzaSbYku63tW9Y9OpwMPGW0Ax5njZDuPXwH/ywcyfDPKPMC', 'PLAYER', true, 'ACTIVE', '2026-03-02 00:10:04.490671+00', '2026-03-02 01:35:53.120387+00');
INSERT INTO public.credentials VALUES (9, 'johan.mulato@gmail.com', '$2a$10$v.VqPPrCVEDwi1YnlxzVJuO3TMyqkP2ADVt/5hyO/LhJMm1OPVgJK', 'PLAYER', true, 'ACTIVE', '2026-03-02 00:11:50.961934+00', '2026-03-02 01:35:58.002674+00');

--
-- Data: join_requests
--

INSERT INTO public.join_requests VALUES (1, 'PENDING', NULL, 9, 3, NULL, '2026-03-02 01:37:04.981867+00', NULL, '2026-03-02 01:37:04.981867+00');
INSERT INTO public.join_requests VALUES (2, 'PENDING', NULL, 10, 3, NULL, '2026-03-02 01:37:32.364767+00', NULL, '2026-03-02 01:37:32.364767+00');
INSERT INTO public.join_requests VALUES (3, 'PENDING', NULL, 11, 3, NULL, '2026-03-02 01:37:55.70173+00', NULL, '2026-03-02 01:37:55.70173+00');
INSERT INTO public.join_requests VALUES (4, 'APPROVED', NULL, 12, 3, NULL, '2026-03-02 01:38:14.320297+00', '2026-03-02 02:14:26.918+00', '2026-03-02 02:14:26.919317+00');

--
-- Data: migrations (TypeORM migration history)
--

INSERT INTO public.migrations VALUES (1, 1745108082711, 'InitialMigration1745108082711');
INSERT INTO public.migrations VALUES (2, 1753664353059, 'MigrationV21753664353059');
INSERT INTO public.migrations VALUES (3, 1764354342129, 'MigrationV31764354342129');
INSERT INTO public.migrations VALUES (4, 1764374779266, 'MigrationV41764374779266');
INSERT INTO public.migrations VALUES (5, 1766880697157, 'MigrationV51766880697157');
INSERT INTO public.migrations VALUES (6, 1769011607360, 'MigrationV61769011607360');
INSERT INTO public.migrations VALUES (7, 1771810995805, 'MigrationV71771810995805');
INSERT INTO public.migrations VALUES (8, 1772928904837, 'MigrationV81772928904837');

--
-- Data: player_clusters
--

INSERT INTO public.player_clusters VALUES (1, 3, 1, '2026-03-02 02:19:25.542562+00', '2026-03-02 02:19:25.542562+00');
INSERT INTO public.player_clusters VALUES (2, 4, 2, '2026-03-02 02:19:25.584239+00', '2026-03-02 02:19:25.584239+00');
INSERT INTO public.player_clusters VALUES (3, 5, 3, '2026-03-02 02:19:25.58891+00', '2026-03-02 02:19:25.58891+00');
INSERT INTO public.player_clusters VALUES (4, 6, 4, '2026-03-02 02:19:25.5969+00', '2026-03-02 02:19:25.5969+00');
INSERT INTO public.player_clusters VALUES (5, 3, 5, '2026-03-02 02:19:25.6027+00', '2026-03-02 02:19:25.6027+00');
INSERT INTO public.player_clusters VALUES (6, 6, 7, '2026-03-02 02:19:25.606726+00', '2026-03-02 02:19:25.606726+00');
INSERT INTO public.player_clusters VALUES (7, 5, 6, '2026-03-02 02:19:25.606672+00', '2026-03-02 02:19:25.606672+00');
INSERT INTO public.player_clusters VALUES (8, 7, 9, '2026-03-02 02:19:25.608834+00', '2026-03-02 02:19:25.608834+00');
INSERT INTO public.player_clusters VALUES (9, 7, 8, '2026-03-02 02:19:25.609018+00', '2026-03-02 02:19:25.609018+00');
INSERT INTO public.player_clusters VALUES (10, 9, 10, '2026-03-02 02:19:25.614341+00', '2026-03-02 02:19:25.614341+00');
INSERT INTO public.player_clusters VALUES (11, 4, 11, '2026-03-02 02:19:25.616235+00', '2026-03-02 02:19:25.616235+00');
INSERT INTO public.player_clusters VALUES (12, 10, 12, '2026-03-02 02:19:25.616452+00', '2026-03-02 02:19:25.616452+00');
INSERT INTO public.player_clusters VALUES (13, 8, 13, '2026-03-02 02:19:25.628368+00', '2026-03-02 02:19:25.628368+00');
INSERT INTO public.player_clusters VALUES (14, 11, 14, '2026-03-02 02:19:25.632733+00', '2026-03-02 02:19:25.632733+00');
INSERT INTO public.player_clusters VALUES (15, 10, 15, '2026-03-02 02:19:25.639517+00', '2026-03-02 02:19:25.639517+00');
INSERT INTO public.player_clusters VALUES (16, 9, 16, '2026-03-02 02:19:25.651199+00', '2026-03-02 02:19:25.651199+00');
INSERT INTO public.player_clusters VALUES (17, 8, 17, '2026-03-02 02:19:25.653158+00', '2026-03-02 02:19:25.653158+00');
INSERT INTO public.player_clusters VALUES (18, 12, 18, '2026-03-02 02:19:25.655815+00', '2026-03-02 02:19:25.655815+00');
INSERT INTO public.player_clusters VALUES (19, 11, 19, '2026-03-02 02:19:25.658014+00', '2026-03-02 02:19:25.658014+00');
INSERT INTO public.player_clusters VALUES (20, 12, 20, '2026-03-02 02:19:25.658876+00', '2026-03-02 02:19:25.658876+00');

--
-- Data: player_teams
--

INSERT INTO public.player_teams VALUES (1, 3, 1, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (2, 4, 1, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (3, 5, 1, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (4, 6, 1, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (5, 7, 1, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (6, 8, 1, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (7, 9, 1, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (8, 10, 1, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (9, 11, 1, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (10, 12, 1, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (11, 3, 2, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (12, 4, 2, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (13, 5, 2, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (14, 6, 2, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (15, 7, 2, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (16, 8, 2, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (17, 9, 2, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (18, 10, 2, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (19, 11, 2, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (20, 12, 2, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (21, 3, 3, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (22, 4, 3, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (23, 5, 3, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (24, 6, 3, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (25, 7, 3, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (26, 8, 3, true, '2010-12-05 00:00:00+00', NULL);
INSERT INTO public.player_teams VALUES (27, 12, 3, true, '2026-03-02 02:14:26.93+00', NULL);

--
-- Data: players
--

INSERT INTO public.players VALUES (1, 'Juan', 'Fernando', '2001-12-31', 1.74, 84.40, 27.88, 0.45, 1.64, 1.57, 1.99, 4.48, 250.00, 'PIVOT', 3, true, '2026-03-02 00:24:12.231192+00', '2026-03-02 00:24:12.231192+00');
INSERT INTO public.players VALUES (2, 'Sergio', 'Demo', '1999-12-31', 1.79, 81.60, 25.47, 0.35, 1.46, 1.32, 1.70, 4.85, 317.00, 'FIXO', 4, true, '2026-03-02 00:25:03.657265+00', '2026-03-02 00:25:03.657265+00');
INSERT INTO public.players VALUES (3, 'Axel', 'Cabal', '2006-12-31', 1.71, 65.20, 22.30, 0.48, 1.84, 2.12, 2.33, 4.30, 228.00, 'WINGER', 5, true, '2026-03-02 00:26:07.26311+00', '2026-03-02 00:26:07.26311+00');
INSERT INTO public.players VALUES (4, 'Jean', 'Carlos', '2005-12-31', 1.64, 64.40, 23.94, 0.44, 1.86, 1.68, 2.03, 4.52, 236.00, 'WINGER', 6, true, '2026-03-02 00:29:53.362971+00', '2026-03-02 00:29:53.362971+00');
INSERT INTO public.players VALUES (5, 'Jacobo', 'Salazar', '2004-12-31', 1.69, 86.50, 30.29, 0.34, 1.35, 1.38, 1.68, 4.95, 263.00, 'PIVOT', 7, true, '2026-03-02 00:30:30.183975+00', '2026-03-02 00:30:30.183975+00');
INSERT INTO public.players VALUES (6, 'Oscar', 'Salazar', '2006-12-31', 1.74, 78.70, 25.99, 0.40, 1.67, 1.54, 1.98, 4.51, 267.00, 'FIXO', 8, true, '2026-03-02 00:31:31.522141+00', '2026-03-02 00:31:31.522141+00');
INSERT INTO public.players VALUES (7, 'Johan', 'Mulato', '2002-12-31', 1.76, 88.90, 28.70, 0.44, 1.71, 1.59, 2.15, 4.45, 266.00, 'WINGER', 9, true, '2026-03-02 00:32:04.858358+00', '2026-03-02 00:32:04.858358+00');
INSERT INTO public.players VALUES (8, 'Samuel', 'Padilla', '2006-12-31', 1.65, 61.60, 22.63, 0.43, 1.94, 1.90, 2.23, 4.29, 226.00, 'WINGER', 10, true, '2026-03-02 00:32:33.94249+00', '2026-03-02 00:32:33.94249+00');
INSERT INTO public.players VALUES (9, 'Juan', 'Henao', '2006-12-31', 1.66, 65.50, 23.77, 0.49, 1.65, 1.60, 2.17, 4.32, 266.00, 'GOALKEEPER', 11, true, '2026-03-02 00:36:30.030903+00', '2026-03-02 00:36:30.030903+00');
INSERT INTO public.players VALUES (10, 'Nicolas', 'Bermudez', '2006-12-31', 1.76, 66.60, 21.50, 0.62, 1.92, 2.13, 2.45, 4.32, 245.00, 'WINGER', 12, true, '2026-03-02 00:37:08.130738+00', '2026-03-02 00:37:08.130738+00');
INSERT INTO public.players VALUES (11, 'Jose', 'Gimenez', '2005-12-31', 1.68, 109.30, 38.73, 0.46, 1.49, 1.73, 2.17, 4.67, 315.00, 'GOALKEEPER', 13, true, '2026-03-02 00:37:54.981139+00', '2026-03-02 00:37:54.981139+00');
INSERT INTO public.players VALUES (12, 'Daniel', 'Cuero', '2006-12-31', 1.79, 78.60, 24.53, 0.64, 1.88, 2.06, 2.42, 4.20, 229.00, 'WINGER', 14, true, '2026-03-02 00:38:32.32662+00', '2026-03-02 00:38:32.32662+00');

--
-- Data: refresh_tokens (omitted for clean start - tokens are expired/session-specific)
--

--
-- Data: teams
--

INSERT INTO public.teams VALUES (1, 'USB Cali', 'Professional', true, '2026-03-02 00:47:02.046492+00', '2026-03-02 00:47:02.046492+00');
INSERT INTO public.teams VALUES (2, 'USB Cali Sub-23', 'Senior', true, '2026-03-02 01:28:11.7036+00', '2026-03-02 01:28:11.7036+00');
INSERT INTO public.teams VALUES (3, 'USB Cali Sub-20', 'Junior', true, '2026-03-02 01:28:30.807152+00', '2026-03-02 01:28:30.807152+00');

--
-- Data: training_assignments
--

INSERT INTO public.training_assignments VALUES (1, 'ACTIVE', 1, 1, NULL, 1, '2026-03-02 01:57:06.291188+00', '2025-05-21 08:00:00+00', '2025-06-21 08:00:00+00', NULL, NULL, '2026-03-02 01:57:06.291188+00');
INSERT INTO public.training_assignments VALUES (2, 'ACTIVE', 1, 2, NULL, 1, '2026-03-02 01:57:10.711053+00', '2025-05-21 08:00:00+00', '2025-06-21 08:00:00+00', NULL, NULL, '2026-03-02 01:57:10.711053+00');
INSERT INTO public.training_assignments VALUES (3, 'ACTIVE', 1, 3, NULL, 1, '2026-03-02 01:57:16.1747+00', '2025-05-21 08:00:00+00', '2025-06-21 08:00:00+00', NULL, NULL, '2026-03-02 01:57:16.1747+00');
INSERT INTO public.training_assignments VALUES (4, 'ACTIVE', 2, 4, NULL, 1, '2026-03-02 01:58:01.646614+00', '2025-05-21 08:00:00+00', '2025-06-21 08:00:00+00', NULL, NULL, '2026-03-02 01:58:01.646614+00');
INSERT INTO public.training_assignments VALUES (5, 'ACTIVE', 2, 5, NULL, 1, '2026-03-02 01:58:04.521039+00', '2025-05-21 08:00:00+00', '2025-06-21 08:00:00+00', NULL, NULL, '2026-03-02 01:58:04.521039+00');
INSERT INTO public.training_assignments VALUES (6, 'ACTIVE', 3, 6, NULL, 1, '2026-03-02 01:58:09.589103+00', '2025-05-21 08:00:00+00', '2025-06-21 08:00:00+00', NULL, NULL, '2026-03-02 01:58:09.589103+00');
INSERT INTO public.training_assignments VALUES (7, 'ACTIVE', 3, 7, NULL, 1, '2026-03-02 01:58:13.693305+00', '2025-05-21 08:00:00+00', '2025-06-21 08:00:00+00', NULL, NULL, '2026-03-02 01:58:13.693305+00');
INSERT INTO public.training_assignments VALUES (8, 'ACTIVE', 4, 8, NULL, 1, '2026-03-02 01:58:20.908173+00', '2025-05-21 08:00:00+00', '2025-06-21 08:00:00+00', NULL, NULL, '2026-03-02 01:58:20.908173+00');
INSERT INTO public.training_assignments VALUES (10, 'ACTIVE', 5, 10, NULL, 1, '2026-03-02 01:58:31.526262+00', '2025-05-21 08:00:00+00', '2025-06-21 08:00:00+00', NULL, NULL, '2026-03-02 01:58:31.526262+00');
INSERT INTO public.training_assignments VALUES (11, 'ACTIVE', 5, 11, NULL, 1, '2026-03-02 01:58:43.03674+00', '2025-05-21 08:00:00+00', '2025-06-21 08:00:00+00', NULL, NULL, '2026-03-02 01:58:43.03674+00');
INSERT INTO public.training_assignments VALUES (12, 'ACTIVE', 5, 12, NULL, 1, '2026-03-02 01:58:50.447699+00', '2025-05-21 08:00:00+00', '2025-06-21 08:00:00+00', NULL, NULL, '2026-03-02 01:58:50.447699+00');
INSERT INTO public.training_assignments VALUES (13, 'ACTIVE', 7, 3, 1, 1, '2026-03-02 02:18:29.83053+00', '2026-03-02 02:18:29.748+00', '2026-04-01 02:18:29.748+00', '2026-03-02 02:18:29.831+00', NULL, '2026-03-02 02:18:29.781596+00');
INSERT INTO public.training_assignments VALUES (15, 'ACTIVE', 7, 9, 1, 1, '2026-03-02 02:18:29.831332+00', '2026-03-02 02:18:29.748+00', '2026-04-01 02:18:29.748+00', '2026-03-02 02:18:29.832+00', NULL, '2026-03-02 02:18:29.799403+00');
INSERT INTO public.training_assignments VALUES (14, 'ACTIVE', 7, 4, 1, 1, '2026-03-02 02:18:29.834162+00', '2026-03-02 02:18:29.748+00', '2026-04-01 02:18:29.748+00', '2026-03-02 02:18:29.835+00', NULL, '2026-03-02 02:18:29.79923+00');
INSERT INTO public.training_assignments VALUES (16, 'ACTIVE', 7, 10, 1, 1, '2026-03-02 02:18:29.851394+00', '2026-03-02 02:18:29.748+00', '2026-04-01 02:18:29.748+00', '2026-03-02 02:18:29.851+00', NULL, '2026-03-02 02:18:29.799418+00');
INSERT INTO public.training_assignments VALUES (17, 'ACTIVE', 7, 6, 1, 1, '2026-03-02 02:18:29.852367+00', '2026-03-02 02:18:29.748+00', '2026-04-01 02:18:29.748+00', '2026-03-02 02:18:29.853+00', NULL, '2026-03-02 02:18:29.800408+00');
INSERT INTO public.training_assignments VALUES (18, 'ACTIVE', 7, 5, 1, 1, '2026-03-02 02:18:29.855864+00', '2026-03-02 02:18:29.748+00', '2026-04-01 02:18:29.748+00', '2026-03-02 02:18:29.856+00', NULL, '2026-03-02 02:18:29.800408+00');
INSERT INTO public.training_assignments VALUES (20, 'ACTIVE', 7, 8, 1, 1, '2026-03-02 02:18:29.856106+00', '2026-03-02 02:18:29.748+00', '2026-04-01 02:18:29.748+00', '2026-03-02 02:18:29.857+00', NULL, '2026-03-02 02:18:29.828776+00');
INSERT INTO public.training_assignments VALUES (19, 'ACTIVE', 7, 7, 1, 1, '2026-03-02 02:18:29.8626+00', '2026-03-02 02:18:29.748+00', '2026-04-01 02:18:29.748+00', '2026-03-02 02:18:29.863+00', NULL, '2026-03-02 02:18:29.815103+00');
INSERT INTO public.training_assignments VALUES (21, 'ACTIVE', 7, 12, 1, 1, '2026-03-02 02:18:29.872257+00', '2026-03-02 02:18:29.748+00', '2026-04-01 02:18:29.748+00', '2026-03-02 02:18:29.872+00', NULL, '2026-03-02 02:18:29.831094+00');
INSERT INTO public.training_assignments VALUES (22, 'ACTIVE', 7, 11, 1, 1, '2026-03-02 02:18:29.891625+00', '2026-03-02 02:18:29.748+00', '2026-04-01 02:18:29.748+00', '2026-03-02 02:18:29.892+00', NULL, '2026-03-02 02:18:29.831474+00');
INSERT INTO public.training_assignments VALUES (9, 'COMPLETED', 5, 9, NULL, 1, '2026-03-02 01:58:27.670021+00', '2025-05-21 08:00:00+00', '2025-06-21 08:00:00+00', '2026-03-02 02:18:29.892+00', NULL, '2026-03-02 01:58:27.670021+00');
INSERT INTO public.training_assignments VALUES (23, 'ACTIVE', 6, 3, 1, 1, '2026-03-04 02:20:59.484979+00', '2026-03-04 00:00:00+00', '2026-04-03 00:00:00+00', '2026-03-04 02:20:59.485+00', NULL, '2026-03-04 02:20:59.437863+00');
INSERT INTO public.training_assignments VALUES (24, 'ACTIVE', 6, 5, 1, 1, '2026-03-04 02:20:59.488408+00', '2026-03-04 00:00:00+00', '2026-04-03 00:00:00+00', '2026-03-04 02:20:59.488+00', NULL, '2026-03-04 02:20:59.458425+00');
INSERT INTO public.training_assignments VALUES (25, 'ACTIVE', 6, 4, 1, 1, '2026-03-04 02:20:59.48925+00', '2026-03-04 00:00:00+00', '2026-04-03 00:00:00+00', '2026-03-04 02:20:59.489+00', NULL, '2026-03-04 02:20:59.45936+00');
INSERT INTO public.training_assignments VALUES (28, 'ACTIVE', 6, 8, 1, 1, '2026-03-04 02:20:59.502334+00', '2026-03-04 00:00:00+00', '2026-04-03 00:00:00+00', '2026-03-04 02:20:59.502+00', NULL, '2026-03-04 02:20:59.460716+00');
INSERT INTO public.training_assignments VALUES (27, 'ACTIVE', 6, 7, 1, 1, '2026-03-04 02:20:59.503722+00', '2026-03-04 00:00:00+00', '2026-04-03 00:00:00+00', '2026-03-04 02:20:59.503+00', NULL, '2026-03-04 02:20:59.460713+00');
INSERT INTO public.training_assignments VALUES (26, 'ACTIVE', 6, 6, 1, 1, '2026-03-04 02:20:59.504048+00', '2026-03-04 00:00:00+00', '2026-04-03 00:00:00+00', '2026-03-04 02:20:59.504+00', NULL, '2026-03-04 02:20:59.459343+00');
INSERT INTO public.training_assignments VALUES (30, 'ACTIVE', 6, 10, 1, 1, '2026-03-04 02:20:59.507224+00', '2026-03-04 00:00:00+00', '2026-04-03 00:00:00+00', '2026-03-04 02:20:59.507+00', NULL, '2026-03-04 02:20:59.485122+00');
INSERT INTO public.training_assignments VALUES (29, 'ACTIVE', 6, 9, 1, 1, '2026-03-04 02:20:59.507637+00', '2026-03-04 00:00:00+00', '2026-04-03 00:00:00+00', '2026-03-04 02:20:59.507+00', NULL, '2026-03-04 02:20:59.4675+00');
INSERT INTO public.training_assignments VALUES (32, 'ACTIVE', 6, 12, 1, 1, '2026-03-04 02:20:59.508857+00', '2026-03-04 00:00:00+00', '2026-04-03 00:00:00+00', '2026-03-04 02:20:59.509+00', NULL, '2026-03-04 02:20:59.487985+00');
INSERT INTO public.training_assignments VALUES (31, 'ACTIVE', 6, 11, 1, 1, '2026-03-04 02:20:59.516104+00', '2026-03-04 00:00:00+00', '2026-04-03 00:00:00+00', '2026-03-04 02:20:59.516+00', NULL, '2026-03-04 02:20:59.487956+00');

--
-- Data: training_plans
--

INSERT INTO public.training_plans VALUES (7, 'Plan táctico IA - USB Cali', 'Análisis general:
El equipo "USB Cali" muestra un predominio de jugadores en la posición de ''Ala'', lo que sugiere un enfoque en el juego por las bandas y la velocidad. La presencia de dos ''Pívots'' proporciona opciones para el juego de retención y pivoteo. El arquero, con su potencia física, añade estabilidad defensiva. Sin embargo, la falta de diversidad en las posiciones y habilidades sugiere un posible desequilibrio estratégico, especialmente en términos de resistencia y explosividad.

Fortalezas del equipo:
- Alta velocidad y agilidad en distancias cortas.
- Excelente capacidad de salto y explosividad en movimientos cortos.
- Buena recuperación física durante el partido.

Debilidades del equipo:
- Resistencia prolongada en jugadores de ''Ala''.
- Potencia muscular general y sostenida.
- Finalización tras regates en velocidad y en carrera.

Ajustes de alineación:
- 

Recomendaciones de entrenamiento:
- Circuitos de resistencia (4 series de 5 minutos, con 1 minuto de descanso) para mejorar la resistencia prolongada.
- Entrenamientos de fuerza explosiva (3 series de 8 repeticiones de saltos pliométricos) para potenciar la explosividad.
- Ejercicios de finalización en velocidad (5 series de 10 repeticiones) con foco en tiros tras regates.', true, 'MEDIUM', 90, 'team-tactical', 'APPROVED', 'Plan grupal generado y aprobado automáticamente por IA', 1, NULL, '2026-03-02 02:18:29.730108+00', '2026-03-02 02:18:29.73+00', NULL, '2026-03-02 02:18:29.698089+00');
INSERT INTO public.training_plans VALUES (1, 'Plan fuerza y resistencia pretemporada', 'Plan de 4 semanas con énfasis en fuerza de tren inferior, core y resistencia aeróbica.', false, 'MEDIUM', 90, 'physical', 'APPROVED', NULL, 1, NULL, '2026-03-02 01:49:47.907993+00', '2026-03-02 02:18:29.73+00', NULL, '2026-03-02 01:49:47.907993+00');
INSERT INTO public.training_plans VALUES (2, 'Adaptación física inicial y prevención de lesiones', 'Microciclo de adaptación: movilidad, estabilidad de core, fuerza general con énfasis en técnica y prevención.', false, 'EASY', 60, 'physical', 'APPROVED', NULL, 1, NULL, '2026-03-02 01:50:30.466293+00', '2026-03-02 02:18:29.73+00', NULL, '2026-03-02 01:50:30.466293+00');
INSERT INTO public.training_plans VALUES (3, 'Potencia anaeróbica y capacidad de repetición de sprints', 'Sesiones de alta intensidad: RSA, pliometría, fuerza explosiva y recuperación guiada. Ideal para fase competitiva.', false, 'HARD', 95, 'physical', 'APPROVED', NULL, 1, NULL, '2026-03-02 01:50:41.511408+00', '2026-03-02 02:18:29.73+00', NULL, '2026-03-02 01:50:41.511408+00');
INSERT INTO public.training_plans VALUES (4, 'Principios tácticos básicos: ocupación y apoyos', 'Estructura ofensiva inicial: líneas de pase, apoyos cortos, cambios de orientación y finalización simple.', false, 'EASY', 70, 'team-tactical', 'APPROVED', NULL, 1, NULL, '2026-03-02 01:50:51.295154+00', '2026-03-02 02:18:29.73+00', NULL, '2026-03-02 01:50:51.295154+00');
INSERT INTO public.training_plans VALUES (5, 'Condición física aplicada con tareas tácticas', 'HIIT integrado en juegos de posesión y transición. Control de carga con descansos estructurados.', false, 'MEDIUM', 85, 'physical & tactical', 'APPROVED', NULL, 1, NULL, '2026-03-02 01:51:10.96603+00', '2026-03-02 02:18:29.73+00', NULL, '2026-03-02 01:51:10.96603+00');
INSERT INTO public.training_plans VALUES (6, 'Fundamentos técnicos: control, pase y finalización', 'Bloque técnico de base: control orientado, pase a un toque, conducción corta y finalización con ambos perfiles.', false, 'EASY', 75, 'technical', 'APPROVED', NULL, 1, NULL, '2026-03-04 02:20:54.253321+00', '2026-03-04 02:20:54.25+00', NULL, '2026-03-02 02:03:53.862259+00');

--
-- Data: training_progress
--

INSERT INTO public.training_progress VALUES (1, '2026-03-01', 100, 'Ninguna dificultad para completar el entrenamiento.', true, NULL, 9, 9, 1, '2026-03-02 02:12:18.638975+00', NULL, '2026-03-02 02:12:18.638975+00');
INSERT INTO public.training_progress VALUES (2, '2026-03-01', 50, 'Aún sigo en proceso, no he podido culminar el entrenamiento.', true, NULL, 10, 10, 1, '2026-03-02 02:13:11.073806+00', NULL, '2026-03-02 02:13:11.073806+00');
INSERT INTO public.training_progress VALUES (3, '2026-03-01', 25, 'Ha sido un entrenamiento bastante complicado.', true, NULL, 11, 11, 1, '2026-03-02 02:13:41.651358+00', NULL, '2026-03-02 02:13:41.651358+00');
INSERT INTO public.training_progress VALUES (4, '2026-03-03', 50, 'Díficil entrenamiento pero bastante provechoso.', true, NULL, 21, 12, NULL, '2026-03-04 02:33:34.879141+00', '2026-03-04 02:33:34.877+00', '2026-03-04 02:22:18.934431+00');

--
-- Sequence values
--

SELECT pg_catalog.setval('public.clusters_id_seq', 20, true);
SELECT pg_catalog.setval('public.coach_teams_id_seq', 3, true);
SELECT pg_catalog.setval('public.coaches_id_seq', 1, true);
SELECT pg_catalog.setval('public.credentials_id_seq', 14, true);
SELECT pg_catalog.setval('public.join_requests_id_seq', 4, true);
SELECT pg_catalog.setval('public.migrations_id_seq', 8, true);
SELECT pg_catalog.setval('public.player_clusters_id_seq', 20, true);
SELECT pg_catalog.setval('public.player_teams_id_seq', 27, true);
SELECT pg_catalog.setval('public.players_id_seq', 12, true);
SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 1, true);
SELECT pg_catalog.setval('public.teams_id_seq', 3, true);
SELECT pg_catalog.setval('public.training_assignments_id_seq', 32, true);
SELECT pg_catalog.setval('public.training_plans_id_seq', 7, true);
SELECT pg_catalog.setval('public.training_progress_id_seq', 4, true);

--
-- Primary keys
--

ALTER TABLE ONLY public.credentials ADD CONSTRAINT "PK_1e38bc43be6697cdda548ad27a6" PRIMARY KEY (id);
ALTER TABLE ONLY public.training_plans ADD CONSTRAINT "PK_246975cb895b51662b90515a390" PRIMARY KEY (id);
ALTER TABLE ONLY public.join_requests ADD CONSTRAINT "PK_3584a09620923a5aaf7de782f0d" PRIMARY KEY (id);
ALTER TABLE ONLY public.coach_teams ADD CONSTRAINT "PK_43798c1e7b56bc6b10660739d65" PRIMARY KEY (id);
ALTER TABLE ONLY public.clusters ADD CONSTRAINT "PK_56c8e201f375e1e961dcdd6831c" PRIMARY KEY (id);
ALTER TABLE ONLY public.refresh_tokens ADD CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY (id);
ALTER TABLE ONLY public.teams ADD CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY (id);
ALTER TABLE ONLY public.migrations ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);
ALTER TABLE ONLY public.training_progress ADD CONSTRAINT "PK_97c9d74dd8beeffd749a90e411b" PRIMARY KEY (id);
ALTER TABLE ONLY public.training_assignments ADD CONSTRAINT "PK_c05e77c7a449a96eb76160a98f8" PRIMARY KEY (id);
ALTER TABLE ONLY public.player_clusters ADD CONSTRAINT "PK_ccc7e4a2444502790521ddd42d3" PRIMARY KEY (id);
ALTER TABLE ONLY public.players ADD CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY (id);
ALTER TABLE ONLY public.player_teams ADD CONSTRAINT "PK_e5590318e146470273cc6fa9b59" PRIMARY KEY (id);
ALTER TABLE ONLY public.coaches ADD CONSTRAINT "PK_eddaece1a1f1b197fa39e6864a1" PRIMARY KEY (id);

--
-- Unique constraints
--

ALTER TABLE ONLY public.players ADD CONSTRAINT "REL_16fbb79bf3b1614f717c8748e7" UNIQUE (credentials_id);
ALTER TABLE ONLY public.coaches ADD CONSTRAINT "REL_5f0f42938eaed4a6f389e24819" UNIQUE (credentials_id);
ALTER TABLE ONLY public.coach_teams ADD CONSTRAINT "UQ_10924594f03c0658c429784dde7" UNIQUE (coaches_id, teams_id);
ALTER TABLE ONLY public.teams ADD CONSTRAINT "UQ_48c0c32e6247a2de155baeaf980" UNIQUE (name);
ALTER TABLE ONLY public.join_requests ADD CONSTRAINT "UQ_5416a8d9ec03b4658e0c8fdb1e8" UNIQUE (players_id, teams_id, status);
ALTER TABLE ONLY public.player_teams ADD CONSTRAINT "UQ_bbbc070a3b8cb4f4c8db775bf49" UNIQUE (players_id, teams_id);
ALTER TABLE ONLY public.credentials ADD CONSTRAINT "UQ_c286aa8e09ecff5cc756ee83214" UNIQUE (email);
ALTER TABLE ONLY public.player_clusters ADD CONSTRAINT "UQ_f0ed116b763dcc742c66a0b137f" UNIQUE (players_id, clusters_id);

--
-- Foreign keys
--

ALTER TABLE ONLY public.player_teams ADD CONSTRAINT "FK_1285ccd0933e3b471634b5716ad" FOREIGN KEY (teams_id) REFERENCES public.teams(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.players ADD CONSTRAINT "FK_16fbb79bf3b1614f717c8748e78" FOREIGN KEY (credentials_id) REFERENCES public.credentials(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.training_plans ADD CONSTRAINT "FK_19991edd64daceec2844b014d44" FOREIGN KEY (created_by_coach_id) REFERENCES public.coaches(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.training_progress ADD CONSTRAINT "FK_2878dcf633823ed69e393b54b81" FOREIGN KEY (recorded_by_player_id) REFERENCES public.players(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.training_plans ADD CONSTRAINT "FK_4fe1780b21714d7120513d7b24c" FOREIGN KEY (clusters_id) REFERENCES public.clusters(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.coaches ADD CONSTRAINT "FK_5f0f42938eaed4a6f389e248193" FOREIGN KEY (credentials_id) REFERENCES public.credentials(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.player_clusters ADD CONSTRAINT "FK_7112a4a1451b2b223ded5bee51d" FOREIGN KEY (clusters_id) REFERENCES public.clusters(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.player_teams ADD CONSTRAINT "FK_743486d990fdaf79891c9fe6cbd" FOREIGN KEY (players_id) REFERENCES public.players(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.refresh_tokens ADD CONSTRAINT "FK_7c5f337a639234c9f0b2ad6b78f" FOREIGN KEY (credentials_id) REFERENCES public.credentials(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.coach_teams ADD CONSTRAINT "FK_92b9acbffbb4238703e8f677b9b" FOREIGN KEY (coaches_id) REFERENCES public.coaches(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.training_assignments ADD CONSTRAINT "FK_a2395e43d565143929965d8a08a" FOREIGN KEY (assigned_by_coach_id) REFERENCES public.coaches(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.training_progress ADD CONSTRAINT "FK_b25d425202d361a69ba791d00c8" FOREIGN KEY (training_assignment_id) REFERENCES public.training_assignments(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.join_requests ADD CONSTRAINT "FK_b90cbbecdf6963d6e6f3b485ac5" FOREIGN KEY (players_id) REFERENCES public.players(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.join_requests ADD CONSTRAINT "FK_bafbc220d60c35fbeff3bd409e4" FOREIGN KEY (coaches_id) REFERENCES public.coaches(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.join_requests ADD CONSTRAINT "FK_bd98c49ccfcd87d4e653d256bfe" FOREIGN KEY (teams_id) REFERENCES public.teams(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.training_assignments ADD CONSTRAINT "FK_d593da100ced00abcffe9576ca8" FOREIGN KEY (teams_id) REFERENCES public.teams(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.coach_teams ADD CONSTRAINT "FK_e194b8df843692eeb19c31ca943" FOREIGN KEY (teams_id) REFERENCES public.teams(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.training_progress ADD CONSTRAINT "FK_e32549ae486def3e2f59913ae7b" FOREIGN KEY (recorded_by_coach_id) REFERENCES public.coaches(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.training_assignments ADD CONSTRAINT "FK_e65a401e7bf14d84b246fe550e6" FOREIGN KEY (training_plan_id) REFERENCES public.training_plans(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.player_clusters ADD CONSTRAINT "FK_e681922025a4a78f930e1037108" FOREIGN KEY (players_id) REFERENCES public.players(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.training_assignments ADD CONSTRAINT "FK_e8d5e62d7c2ef3d107f96bcbb05" FOREIGN KEY (players_id) REFERENCES public.players(id) ON DELETE CASCADE;
