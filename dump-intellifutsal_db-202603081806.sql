--
-- PostgreSQL database dump
--

\restrict UwbmJbWSZo9ICq4Q76h8qiOLG5k8FH5hayW8ckDdyF4wcQe29eObFtOA44rgRWG

-- Dumped from database version 14.21
-- Dumped by pg_dump version 16.11 (Homebrew)

-- Started on 2026-03-08 18:06:20 -05

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

DROP DATABASE intellifutsal_db;
--
-- TOC entry 3623 (class 1262 OID 16384)
-- Name: intellifutsal_db; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE intellifutsal_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


\unrestrict UwbmJbWSZo9ICq4Q76h8qiOLG5k8FH5hayW8ckDdyF4wcQe29eObFtOA44rgRWG
\connect intellifutsal_db
\restrict UwbmJbWSZo9ICq4Q76h8qiOLG5k8FH5hayW8ckDdyF4wcQe29eObFtOA44rgRWG

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 906 (class 1247 OID 16751)
-- Name: credentials_onboardingstatus_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.credentials_onboardingstatus_enum AS ENUM (
    'REGISTERED',
    'PROFILE_CREATED',
    'PROFILE_INCOMPLETE',
    'TEAM_PENDING',
    'COACH_PENDING_APPROVAL',
    'ACTIVE'
);


--
-- TOC entry 903 (class 1247 OID 16695)
-- Name: credentials_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.credentials_role_enum AS ENUM (
    'PLAYER',
    'COACH',
    'ADMIN'
);


--
-- TOC entry 879 (class 1247 OID 16533)
-- Name: join_requests_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.join_requests_status_enum AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


--
-- TOC entry 870 (class 1247 OID 16458)
-- Name: players_position_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.players_position_enum AS ENUM (
    'GOALKEEPER',
    'FIXO',
    'WINGER',
    'PIVOT'
);


--
-- TOC entry 885 (class 1247 OID 16556)
-- Name: training_assignments_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.training_assignments_status_enum AS ENUM (
    'PENDING',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED'
);


--
-- TOC entry 891 (class 1247 OID 16575)
-- Name: training_plans_status_enum; Type: TYPE; Schema: public; Owner: -
--

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
-- TOC entry 212 (class 1259 OID 16395)
-- Name: clusters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clusters (
    id integer NOT NULL,
    description text NOT NULL,
    creation_date timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 211 (class 1259 OID 16394)
-- Name: clusters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clusters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3624 (class 0 OID 0)
-- Dependencies: 211
-- Name: clusters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clusters_id_seq OWNED BY public.clusters.id;


--
-- TOC entry 214 (class 1259 OID 16405)
-- Name: coach_teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coach_teams (
    id integer NOT NULL,
    coaches_id integer,
    teams_id integer,
    status boolean DEFAULT true NOT NULL,
    assignment_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone
);


--
-- TOC entry 213 (class 1259 OID 16404)
-- Name: coach_teams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coach_teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3625 (class 0 OID 0)
-- Dependencies: 213
-- Name: coach_teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coach_teams_id_seq OWNED BY public.coach_teams.id;


--
-- TOC entry 216 (class 1259 OID 16415)
-- Name: coaches; Type: TABLE; Schema: public; Owner: -
--

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


--
-- TOC entry 215 (class 1259 OID 16414)
-- Name: coaches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coaches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3626 (class 0 OID 0)
-- Dependencies: 215
-- Name: coaches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coaches_id_seq OWNED BY public.coaches.id;


--
-- TOC entry 218 (class 1259 OID 16430)
-- Name: credentials; Type: TABLE; Schema: public; Owner: -
--

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


--
-- TOC entry 217 (class 1259 OID 16429)
-- Name: credentials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.credentials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3627 (class 0 OID 0)
-- Dependencies: 217
-- Name: credentials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.credentials_id_seq OWNED BY public.credentials.id;


--
-- TOC entry 228 (class 1259 OID 16542)
-- Name: join_requests; Type: TABLE; Schema: public; Owner: -
--

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


--
-- TOC entry 227 (class 1259 OID 16541)
-- Name: join_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.join_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3628 (class 0 OID 0)
-- Dependencies: 227
-- Name: join_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.join_requests_id_seq OWNED BY public.join_requests.id;


--
-- TOC entry 210 (class 1259 OID 16386)
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


--
-- TOC entry 209 (class 1259 OID 16385)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3629 (class 0 OID 0)
-- Dependencies: 209
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 220 (class 1259 OID 16440)
-- Name: player_clusters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_clusters (
    id integer NOT NULL,
    players_id integer,
    clusters_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 219 (class 1259 OID 16439)
-- Name: player_clusters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.player_clusters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3630 (class 0 OID 0)
-- Dependencies: 219
-- Name: player_clusters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.player_clusters_id_seq OWNED BY public.player_clusters.id;


--
-- TOC entry 222 (class 1259 OID 16449)
-- Name: player_teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_teams (
    id integer NOT NULL,
    players_id integer,
    teams_id integer,
    status boolean DEFAULT true NOT NULL,
    entry_date timestamp with time zone DEFAULT now() NOT NULL,
    exit_date timestamp with time zone
);


--
-- TOC entry 221 (class 1259 OID 16448)
-- Name: player_teams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.player_teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3631 (class 0 OID 0)
-- Dependencies: 221
-- Name: player_teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.player_teams_id_seq OWNED BY public.player_teams.id;


--
-- TOC entry 224 (class 1259 OID 16468)
-- Name: players; Type: TABLE; Schema: public; Owner: -
--

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


--
-- TOC entry 223 (class 1259 OID 16467)
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3632 (class 0 OID 0)
-- Dependencies: 223
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- TOC entry 236 (class 1259 OID 16669)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    token character varying(500) NOT NULL,
    revoked boolean DEFAULT false NOT NULL,
    credentials_id integer,
    expires_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 235 (class 1259 OID 16668)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3633 (class 0 OID 0)
-- Dependencies: 235
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- TOC entry 226 (class 1259 OID 16477)
-- Name: teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    category character varying(50) NOT NULL,
    status boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 225 (class 1259 OID 16476)
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3634 (class 0 OID 0)
-- Dependencies: 225
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- TOC entry 230 (class 1259 OID 16566)
-- Name: training_assignments; Type: TABLE; Schema: public; Owner: -
--

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


--
-- TOC entry 229 (class 1259 OID 16565)
-- Name: training_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.training_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3635 (class 0 OID 0)
-- Dependencies: 229
-- Name: training_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.training_assignments_id_seq OWNED BY public.training_assignments.id;


--
-- TOC entry 232 (class 1259 OID 16586)
-- Name: training_plans; Type: TABLE; Schema: public; Owner: -
--

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


--
-- TOC entry 231 (class 1259 OID 16585)
-- Name: training_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.training_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3636 (class 0 OID 0)
-- Dependencies: 231
-- Name: training_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.training_plans_id_seq OWNED BY public.training_plans.id;


--
-- TOC entry 234 (class 1259 OID 16598)
-- Name: training_progress; Type: TABLE; Schema: public; Owner: -
--

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


--
-- TOC entry 233 (class 1259 OID 16597)
-- Name: training_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.training_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3637 (class 0 OID 0)
-- Dependencies: 233
-- Name: training_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.training_progress_id_seq OWNED BY public.training_progress.id;


--
-- TOC entry 3335 (class 2604 OID 16398)
-- Name: clusters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clusters ALTER COLUMN id SET DEFAULT nextval('public.clusters_id_seq'::regclass);


--
-- TOC entry 3337 (class 2604 OID 16408)
-- Name: coach_teams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_teams ALTER COLUMN id SET DEFAULT nextval('public.coach_teams_id_seq'::regclass);


--
-- TOC entry 3340 (class 2604 OID 16418)
-- Name: coaches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaches ALTER COLUMN id SET DEFAULT nextval('public.coaches_id_seq'::regclass);


--
-- TOC entry 3345 (class 2604 OID 16433)
-- Name: credentials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credentials ALTER COLUMN id SET DEFAULT nextval('public.credentials_id_seq'::regclass);


--
-- TOC entry 3365 (class 2604 OID 16545)
-- Name: join_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.join_requests ALTER COLUMN id SET DEFAULT nextval('public.join_requests_id_seq'::regclass);


--
-- TOC entry 3334 (class 2604 OID 16389)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 3351 (class 2604 OID 16443)
-- Name: player_clusters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_clusters ALTER COLUMN id SET DEFAULT nextval('public.player_clusters_id_seq'::regclass);


--
-- TOC entry 3354 (class 2604 OID 16452)
-- Name: player_teams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_teams ALTER COLUMN id SET DEFAULT nextval('public.player_teams_id_seq'::regclass);


--
-- TOC entry 3357 (class 2604 OID 16471)
-- Name: players id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);


--
-- TOC entry 3382 (class 2604 OID 16672)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 3361 (class 2604 OID 16480)
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- TOC entry 3369 (class 2604 OID 16569)
-- Name: training_assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_assignments ALTER COLUMN id SET DEFAULT nextval('public.training_assignments_id_seq'::regclass);


--
-- TOC entry 3373 (class 2604 OID 16589)
-- Name: training_plans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_plans ALTER COLUMN id SET DEFAULT nextval('public.training_plans_id_seq'::regclass);


--
-- TOC entry 3378 (class 2604 OID 16601)
-- Name: training_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_progress ALTER COLUMN id SET DEFAULT nextval('public.training_progress_id_seq'::regclass);


--
-- TOC entry 3593 (class 0 OID 16395)
-- Dependencies: 212
-- Data for Name: clusters; Type: TABLE DATA; Schema: public; Owner: -
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
-- TOC entry 3595 (class 0 OID 16405)
-- Dependencies: 214
-- Data for Name: coach_teams; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.coach_teams VALUES (1, 1, 1, true, '2026-02-05 00:00:00+00', NULL);
INSERT INTO public.coach_teams VALUES (2, 1, 2, true, '2026-02-05 00:00:00+00', NULL);
INSERT INTO public.coach_teams VALUES (3, 1, 3, true, '2026-02-05 00:00:00+00', NULL);


--
-- TOC entry 3597 (class 0 OID 16415)
-- Dependencies: 216
-- Data for Name: coaches; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.coaches VALUES (1, 'Carlos', 'Ramírez', '1988-03-14', 12.00, 'Entrenamiento táctico y desarrollo físico en fútbol sala', 2, true, '2026-03-02 00:22:53.664059+00', '2026-03-02 00:22:53.664059+00');


--
-- TOC entry 3599 (class 0 OID 16430)
-- Dependencies: 218
-- Data for Name: credentials; Type: TABLE DATA; Schema: public; Owner: -
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
-- TOC entry 3609 (class 0 OID 16542)
-- Dependencies: 228
-- Data for Name: join_requests; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.join_requests VALUES (1, 'PENDING', NULL, 9, 3, NULL, '2026-03-02 01:37:04.981867+00', NULL, '2026-03-02 01:37:04.981867+00');
INSERT INTO public.join_requests VALUES (2, 'PENDING', NULL, 10, 3, NULL, '2026-03-02 01:37:32.364767+00', NULL, '2026-03-02 01:37:32.364767+00');
INSERT INTO public.join_requests VALUES (3, 'PENDING', NULL, 11, 3, NULL, '2026-03-02 01:37:55.70173+00', NULL, '2026-03-02 01:37:55.70173+00');
INSERT INTO public.join_requests VALUES (4, 'APPROVED', NULL, 12, 3, NULL, '2026-03-02 01:38:14.320297+00', '2026-03-02 02:14:26.918+00', '2026-03-02 02:14:26.919317+00');


--
-- TOC entry 3591 (class 0 OID 16386)
-- Dependencies: 210
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
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
-- TOC entry 3601 (class 0 OID 16440)
-- Dependencies: 220
-- Data for Name: player_clusters; Type: TABLE DATA; Schema: public; Owner: -
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
-- TOC entry 3603 (class 0 OID 16449)
-- Dependencies: 222
-- Data for Name: player_teams; Type: TABLE DATA; Schema: public; Owner: -
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
-- TOC entry 3605 (class 0 OID 16468)
-- Dependencies: 224
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: -
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
-- TOC entry 3617 (class 0 OID 16669)
-- Dependencies: 236
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.refresh_tokens VALUES (1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDA5NjA1LCJleHAiOjE3NzMwMTQ0MDV9.bsmhhS5Qaf1aQ8W8HyiPP5oOT7z85JwTHRfZ8_-wIiM', false, 1, '2026-03-09 00:00:05+00', '2026-03-02 00:00:05.055295+00');
INSERT INTO public.refresh_tokens VALUES (2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MDk4NzEsImV4cCI6MTc3MzAxNDY3MX0.FTYHenJPy9xvlMQi8cLBhLsfYZmQPBGaAtwbnLjT9nc', false, 2, '2026-03-09 00:04:31+00', '2026-03-02 00:04:31.932544+00');
INSERT INTO public.refresh_tokens VALUES (3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJqdWFuLmZlcm5hbmRvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MDk5MTcsImV4cCI6MTc3MzAxNDcxN30.D7ZYJYfLY3cOTaMNCNxY4oLM6WtEJGVgok6IqbaBsnI', false, 3, '2026-03-09 00:05:17+00', '2026-03-02 00:05:17.250298+00');
INSERT INTO public.refresh_tokens VALUES (4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJzZXJnaW9AZ21haWwuY29tIiwicm9sZSI6IlBMQVlFUiIsImlhdCI6MTc3MjQxMDAwMSwiZXhwIjoxNzczMDE0ODAxfQ.Ol2SrkEflHDiO2Zm-nzufplE4TPbeaSnQnDCuR8S-yU', false, 4, '2026-03-09 00:06:41+00', '2026-03-02 00:06:41.769029+00');
INSERT INTO public.refresh_tokens VALUES (5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJheGVsLmNhYmFsQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTAwMjMsImV4cCI6MTc3MzAxNDgyM30.9WNMBYECi8QpzLh6psqOhykvgJvBn_7Bej0SzSBR1T4', false, 5, '2026-03-09 00:07:03+00', '2026-03-02 00:07:03.281424+00');
INSERT INTO public.refresh_tokens VALUES (6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJqZWFuLmNhcmxvc0BnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDEwMTY2LCJleHAiOjE3NzMwMTQ5NjZ9.nvSmbloVpL1zrugSZzXVlwPqHerz8EGPM1mxKifguqI', false, 6, '2026-03-09 00:09:26+00', '2026-03-02 00:09:26.970928+00');
INSERT INTO public.refresh_tokens VALUES (7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJqYWNvYm8uc2FsYXphckBnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDEwMTk2LCJleHAiOjE3NzMwMTQ5OTZ9.mQYa2e1V7nV-laXKChiUfo4RmcTTn2JOEKNCOcpD9Qs', false, 7, '2026-03-09 00:09:56+00', '2026-03-02 00:09:56.328586+00');
INSERT INTO public.refresh_tokens VALUES (8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJvc2Nhci5zYWxhemFyQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTAyMDQsImV4cCI6MTc3MzAxNTAwNH0.f3xVObvAe9GwU6NuyWtIIQT3Oy2H45GRpYtoEQUeBI8', false, 8, '2026-03-09 00:10:04+00', '2026-03-02 00:10:04.496448+00');
INSERT INTO public.refresh_tokens VALUES (9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJqb2hhbi5tdWxhdG9AZ21haWwuY29tIiwicm9sZSI6IlBMQVlFUiIsImlhdCI6MTc3MjQxMDMxMCwiZXhwIjoxNzczMDE1MTEwfQ.8ITZQF9AQRaTBkp-n3vfW1oEqj1b6OpFW22D_p_YJOA', false, 9, '2026-03-09 00:11:50+00', '2026-03-02 00:11:50.971634+00');
INSERT INTO public.refresh_tokens VALUES (10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoic2FtdWVsLnBhZGlsbGFAZ21haWwuY29tIiwicm9sZSI6IlBMQVlFUiIsImlhdCI6MTc3MjQxMDMyNiwiZXhwIjoxNzczMDE1MTI2fQ.a22ugpjV8QICnhkKEOOsYiYZ_f10hEL6uEFKwkTBX6c', false, 10, '2026-03-09 00:12:06+00', '2026-03-02 00:12:06.86077+00');
INSERT INTO public.refresh_tokens VALUES (11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoianVhbi5oZW5hb0BnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDEwMzM2LCJleHAiOjE3NzMwMTUxMzZ9.zgvNXj4Fj2bp8kLLa7H-6zHPRMSb_vEM4eZJ4fI_9tc', false, 11, '2026-03-09 00:12:16+00', '2026-03-02 00:12:16.72454+00');
INSERT INTO public.refresh_tokens VALUES (12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoibmljb2xhcy5iZXJtdWRlekBnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDEwMzQ5LCJleHAiOjE3NzMwMTUxNDl9.ogsyBlu9_LnCMqBaYhubVi3CS064jP1ZjuqEagTDdB8', false, 12, '2026-03-09 00:12:29+00', '2026-03-02 00:12:29.627653+00');
INSERT INTO public.refresh_tokens VALUES (13, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoiam9zZS5naW1lbmV6QGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTAzNzIsImV4cCI6MTc3MzAxNTE3Mn0.PFq9bau5G2TdgfPgM6CPV4DEXsCj1tcKnjN_v4PJgqA', false, 13, '2026-03-09 00:12:52+00', '2026-03-02 00:12:52.90928+00');
INSERT INTO public.refresh_tokens VALUES (14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTAzODQsImV4cCI6MTc3MzAxNTE4NH0.r5cTluG69RuJhg34t_pNG3Zlonr0n3oCCE_0cbMobnM', false, 14, '2026-03-09 00:13:04+00', '2026-03-02 00:13:04.029836+00');
INSERT INTO public.refresh_tokens VALUES (15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTA1NjUsImV4cCI6MTc3MzAxNTM2NX0.fJdaeQX-rHsly3wa1cPAzsTiEUvW1-A4eCxLC3jLfVE', false, 1, '2026-03-09 00:16:05+00', '2026-03-02 00:16:05.065217+00');
INSERT INTO public.refresh_tokens VALUES (16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTA2MDgsImV4cCI6MTc3MzAxNTQwOH0.CVk_ofM9HJhryIzBd9GwHLLDQhBHtK4W3aUVweQhyOs', false, 2, '2026-03-09 00:16:48+00', '2026-03-02 00:16:48.397612+00');
INSERT INTO public.refresh_tokens VALUES (17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJqdWFuLmZlcm5hbmRvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTEwNDIsImV4cCI6MTc3MzAxNTg0Mn0.Dd2gFSltOde0tavU9QSvx1EPVgQPeW84wlT6mLjRO0Y', false, 3, '2026-03-09 00:24:02+00', '2026-03-02 00:24:02.36233+00');
INSERT INTO public.refresh_tokens VALUES (18, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJzZXJnaW9AZ21haWwuY29tIiwicm9sZSI6IlBMQVlFUiIsImlhdCI6MTc3MjQxMTA5MiwiZXhwIjoxNzczMDE1ODkyfQ.756Pr346d4aBBCKzIpPOA_F-aUNnWeYrXHgv-teDr0k', false, 4, '2026-03-09 00:24:52+00', '2026-03-02 00:24:52.711974+00');
INSERT INTO public.refresh_tokens VALUES (19, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJheGVsLmNhYmFsQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTExNTMsImV4cCI6MTc3MzAxNTk1M30.n3jiGNUP8wr30Q_bU_FpSetJxXCoFfJiv3LBfQXYg4s', false, 5, '2026-03-09 00:25:53+00', '2026-03-02 00:25:53.70392+00');
INSERT INTO public.refresh_tokens VALUES (20, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJqZWFuLmNhcmxvc0BnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDExMzgxLCJleHAiOjE3NzMwMTYxODF9.zJUuqbJQ8JCkj6DzvzMrEmNyJV4c0V1u9w8r8bqENFU', false, 6, '2026-03-09 00:29:41+00', '2026-03-02 00:29:41.237674+00');
INSERT INTO public.refresh_tokens VALUES (21, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJqYWNvYm8uc2FsYXphckBnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDExNDE4LCJleHAiOjE3NzMwMTYyMTh9.wwY_9UsXTvp-rIuqxP1a5UUH3L6SPZu_8mK8We8GluI', false, 7, '2026-03-09 00:30:18+00', '2026-03-02 00:30:18.911271+00');
INSERT INTO public.refresh_tokens VALUES (22, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJvc2Nhci5zYWxhemFyQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTE0NzgsImV4cCI6MTc3MzAxNjI3OH0.ARgX7QXBEwbYw-iiHNPkC0VTehJbtDKug-tuOA8ghmQ', false, 8, '2026-03-09 00:31:18+00', '2026-03-02 00:31:18.524527+00');
INSERT INTO public.refresh_tokens VALUES (23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJqb2hhbi5tdWxhdG9AZ21haWwuY29tIiwicm9sZSI6IlBMQVlFUiIsImlhdCI6MTc3MjQxMTUxNCwiZXhwIjoxNzczMDE2MzE0fQ.p7fE_ZBVyGdoRFalOurFR0o5aCXHu96m6rfnOkbakj0', false, 9, '2026-03-09 00:31:54+00', '2026-03-02 00:31:54.714571+00');
INSERT INTO public.refresh_tokens VALUES (24, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoic2FtdWVsLnBhZGlsbGFAZ21haWwuY29tIiwicm9sZSI6IlBMQVlFUiIsImlhdCI6MTc3MjQxMTU0MiwiZXhwIjoxNzczMDE2MzQyfQ.ecVN4b0z4XHGUe-Aijvx8U_2G4a-p_Z4p0SKDnnuSMI', false, 10, '2026-03-09 00:32:22+00', '2026-03-02 00:32:22.24129+00');
INSERT INTO public.refresh_tokens VALUES (25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoianVhbi5oZW5hb0BnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDExNzcwLCJleHAiOjE3NzMwMTY1NzB9.PWZH5VL99Eklsnq-rZdMNYVfrw0WekX09nBDsp0-YmE', false, 11, '2026-03-09 00:36:10+00', '2026-03-02 00:36:10.228674+00');
INSERT INTO public.refresh_tokens VALUES (26, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoibmljb2xhcy5iZXJtdWRlekBnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDExODE2LCJleHAiOjE3NzMwMTY2MTZ9.JS47hDmjI0byYtcHjnrjPwH_bLOFOjul_5tCM-g5Rk4', false, 12, '2026-03-09 00:36:56+00', '2026-03-02 00:36:56.454078+00');
INSERT INTO public.refresh_tokens VALUES (27, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoiam9zZS5naW1lbmV6QGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTE4NjUsImV4cCI6MTc3MzAxNjY2NX0.P76WZHcTM-FTCEMZY3xMc6M0bO9wLAy3ViOobSxfkbU', false, 13, '2026-03-09 00:37:45+00', '2026-03-02 00:37:45.109359+00');
INSERT INTO public.refresh_tokens VALUES (28, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTE5MDIsImV4cCI6MTc3MzAxNjcwMn0.-pFw6Rb8zDwBGNzCmkCGsGDUrxXXyGJj6iPcTnPnHFo', false, 14, '2026-03-09 00:38:22+00', '2026-03-02 00:38:22.779144+00');
INSERT INTO public.refresh_tokens VALUES (29, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTI0MDQsImV4cCI6MTc3MzAxNzIwNH0._RfiRppYVFd6z1xWxOu0fgWslKuaaAOYIg68fEA7ivM', false, 1, '2026-03-09 00:46:44+00', '2026-03-02 00:46:44.114559+00');
INSERT INTO public.refresh_tokens VALUES (30, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTQ4NzQsImV4cCI6MTc3MzAxOTY3NH0.BBxT1YRCjDxr0JMiPkIeSzS2_91YbRaZ-Gpp5g1y-rk', false, 1, '2026-03-09 01:27:54+00', '2026-03-02 01:27:54.057987+00');
INSERT INTO public.refresh_tokens VALUES (31, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTQ5OTksImV4cCI6MTc3MzAxOTc5OX0.3S_o2MVNq7uFdHQCQgtx3tvUkb1INgXMjZFkA9h1Gro', false, 2, '2026-03-09 01:29:59+00', '2026-03-02 01:29:59.204676+00');
INSERT INTO public.refresh_tokens VALUES (32, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTUxMzcsImV4cCI6MTc3MzAxOTkzN30.fmNZbBPahiSHyTUHNas0Axa9aayM5qjFawgQNwD2OFg', false, 2, '2026-03-09 01:32:17+00', '2026-03-02 01:32:17.667115+00');
INSERT INTO public.refresh_tokens VALUES (33, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoianVhbi5oZW5hb0BnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDE1NDE2LCJleHAiOjE3NzMwMjAyMTZ9.me3EcfTa3ubdapOlVARyxh6IBAISdh4kuLib-o5t1Dg', false, 11, '2026-03-09 01:36:56+00', '2026-03-02 01:36:56.446995+00');
INSERT INTO public.refresh_tokens VALUES (34, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoibmljb2xhcy5iZXJtdWRlekBnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDE1NDQyLCJleHAiOjE3NzMwMjAyNDJ9.gADnds7W1oI0JtxTO6SEkhW05RPw370gTT1pZssRBL8', false, 12, '2026-03-09 01:37:22+00', '2026-03-02 01:37:22.041521+00');
INSERT INTO public.refresh_tokens VALUES (35, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoiam9zZS5naW1lbmV6QGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTU0NjYsImV4cCI6MTc3MzAyMDI2Nn0.I2BRKN4_yUnuO12CE2Kj49vr4wnkp-vTWwMmym25hVY', false, 13, '2026-03-09 01:37:46+00', '2026-03-02 01:37:46.473095+00');
INSERT INTO public.refresh_tokens VALUES (36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTU0ODUsImV4cCI6MTc3MzAyMDI4NX0.CKUXqPug_5lq3UW2p0_Ak9ZDbxzvrwoQjxuiD7SQDvI', false, 14, '2026-03-09 01:38:05+00', '2026-03-02 01:38:05.553088+00');
INSERT INTO public.refresh_tokens VALUES (37, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTYxNjIsImV4cCI6MTc3MzAyMDk2Mn0.OqSQol2VF_C_K1PTdxTOWqoxJXnDbNkQXOHgHmKuwno', false, 2, '2026-03-09 01:49:22+00', '2026-03-02 01:49:22.174443+00');
INSERT INTO public.refresh_tokens VALUES (38, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTYzNDcsImV4cCI6MTc3MzAyMTE0N30.WI3YxIQZUqX92Zl5uBc2g8IkY6KzVhi9Lr4vBGxYT7M', true, 2, '2026-03-09 01:52:27+00', '2026-03-02 01:52:27.151838+00');
INSERT INTO public.refresh_tokens VALUES (39, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTY3NDIsImV4cCI6MTc3MzAyMTU0Mn0.ILJCc_fzbFLSg5m4NyqrGW-G_9L89It6seTjKCVvePg', true, 2, '2026-03-09 01:59:02+00', '2026-03-02 01:59:02.946787+00');
INSERT INTO public.refresh_tokens VALUES (40, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTY3NDUsImV4cCI6MTc3MzAyMTU0NX0.N9c7lcWCmv8uIXCZlbheCcwUko5QbcKJ1cNQcIieUEY', true, 2, '2026-03-09 01:59:05+00', '2026-03-02 01:59:05.085021+00');
INSERT INTO public.refresh_tokens VALUES (41, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTY5NjgsImV4cCI6MTc3MzAyMTc2OH0.ONeYGBddmEohnFuX3iyYa_fWAaww9fHLpYXQczCehiA', true, 2, '2026-03-09 02:02:48+00', '2026-03-02 02:02:48.401297+00');
INSERT INTO public.refresh_tokens VALUES (42, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTcwMzcsImV4cCI6MTc3MzAyMTgzN30.kB7TBHSRvulve49uJJZ32n2OxgLwzQy1fxMLEWKm8RQ', true, 2, '2026-03-09 02:03:57+00', '2026-03-02 02:03:57.275078+00');
INSERT INTO public.refresh_tokens VALUES (43, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJheGVsLmNhYmFsQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTcxMjcsImV4cCI6MTc3MzAyMTkyN30.LQb0HDE0KBDDHTs8rydJMdse2wcmJ3AwuX116sHg2tw', true, 5, '2026-03-09 02:05:27+00', '2026-03-02 02:05:27.795059+00');
INSERT INTO public.refresh_tokens VALUES (44, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJheGVsLmNhYmFsQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTcyMDcsImV4cCI6MTc3MzAyMjAwN30.8KcsjGmufoBP-Yi0yEtO__pbKC3ympmEHM-XWHyDhzU', true, 5, '2026-03-09 02:06:47+00', '2026-03-02 02:06:47.717801+00');
INSERT INTO public.refresh_tokens VALUES (45, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTcyMjksImV4cCI6MTc3MzAyMjAyOX0.y2fltzFZTndihL8_qBYXd9pECc_zARrkWvk6lk2_wms', true, 2, '2026-03-09 02:07:09+00', '2026-03-02 02:07:09.963171+00');
INSERT INTO public.refresh_tokens VALUES (46, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoianVhbi5oZW5hb0BnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDE3NTE1LCJleHAiOjE3NzMwMjIzMTV9.F5xfp28kPpXdXPA0E2UfIqSvdrNrWMU46RyDvjRNqa4', true, 11, '2026-03-09 02:11:55+00', '2026-03-02 02:11:55.687184+00');
INSERT INTO public.refresh_tokens VALUES (47, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoibmljb2xhcy5iZXJtdWRlekBnbWFpbC5jb20iLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNzcyNDE3NTYwLCJleHAiOjE3NzMwMjIzNjB9.rAfVpA83ZeorJDghHNRo8cmS-hok-AqUewaOiiGxwwg', true, 12, '2026-03-09 02:12:40+00', '2026-03-02 02:12:40.203441+00');
INSERT INTO public.refresh_tokens VALUES (48, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoiam9zZS5naW1lbmV6QGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI0MTc2MDYsImV4cCI6MTc3MzAyMjQwNn0.Ii6Je3Vdhe5oQK3VRxtlywjtJfufKaMs6OeBC0C6BfQ', true, 13, '2026-03-09 02:13:26+00', '2026-03-02 02:13:26.29391+00');
INSERT INTO public.refresh_tokens VALUES (49, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI0MTc2MzUsImV4cCI6MTc3MzAyMjQzNX0.VYfK0zaF_6fqx1dGnL_QsbsVIi1uglk9-d93iQGEfFU', true, 2, '2026-03-09 02:13:55+00', '2026-03-02 02:13:55.653538+00');
INSERT INTO public.refresh_tokens VALUES (50, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI1MTEzNjgsImV4cCI6MTc3MzExNjE2OH0.R7Qy9x1YvJfHPNv-tWTMcX3rBqMUVS2sO0ZHgyltRUw', true, 2, '2026-03-10 04:16:08+00', '2026-03-03 04:16:08.130427+00');
INSERT INTO public.refresh_tokens VALUES (51, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI1ODk3OTcsImV4cCI6MTc3MzE5NDU5N30.CDCIxDaMi9j4yLmsoePkq9CSAYyzWCr1O3uiyA7ejBY', true, 2, '2026-03-11 02:03:17+00', '2026-03-04 02:03:17.653595+00');
INSERT INTO public.refresh_tokens VALUES (52, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI1ODk5ODcsImV4cCI6MTc3MzE5NDc4N30.vQoYN5FPYXJFTtl8Y-jVpKqPGRkPugvvPSvbqAUiuyc', true, 2, '2026-03-11 02:06:27+00', '2026-03-04 02:06:27.01823+00');
INSERT INTO public.refresh_tokens VALUES (53, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI1OTAwMDEsImV4cCI6MTc3MzE5NDgwMX0.mh26HAifuWZ1s2NS-FP4YTMgCv26IGZPXfLvm-LIIGg', true, 2, '2026-03-11 02:06:41+00', '2026-03-04 02:06:41.07816+00');
INSERT INTO public.refresh_tokens VALUES (54, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI1OTAwNTYsImV4cCI6MTc3MzE5NDg1Nn0.sOiqPy1GtGWPaWZOhlrGGlHH2z3n992BqAamYk3UfUY', true, 2, '2026-03-11 02:07:36+00', '2026-03-04 02:07:36.3293+00');
INSERT INTO public.refresh_tokens VALUES (55, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI1OTAxNzcsImV4cCI6MTc3MzE5NDk3N30.u9wo71Yah9xStveoui8RX0TcWo0bKvumK8H5pPYBLVU', true, 2, '2026-03-11 02:09:37+00', '2026-03-04 02:09:37.375497+00');
INSERT INTO public.refresh_tokens VALUES (56, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI1OTAyNzEsImV4cCI6MTc3MzE5NTA3MX0.uUpKUfbiyDEl-w7qPDoUJy6QaiceKLZPbSB2uTczAxU', true, 2, '2026-03-11 02:11:11+00', '2026-03-04 02:11:11.021377+00');
INSERT INTO public.refresh_tokens VALUES (57, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI1OTA4MTksImV4cCI6MTc3MzE5NTYxOX0.i949oNQjsDg86WjQZ8fEP5DyEX0IB1_mmBI9Mp2WaO4', true, 2, '2026-03-11 02:20:19+00', '2026-03-04 02:20:19.248271+00');
INSERT INTO public.refresh_tokens VALUES (58, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI1OTA5MDcsImV4cCI6MTc3MzE5NTcwN30.R08GjfMzcWX4pS7S6vw9_j34Rj-yCTqdi_4kIoOPc7U', true, 14, '2026-03-11 02:21:47+00', '2026-03-04 02:21:47.555133+00');
INSERT INTO public.refresh_tokens VALUES (59, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI1OTA5NTYsImV4cCI6MTc3MzE5NTc1Nn0.OyMtxgFjOIS5IILRYAiKz7hnjV4l_xbLM_3ThKww1zU', true, 2, '2026-03-11 02:22:36+00', '2026-03-04 02:22:36.205806+00');
INSERT INTO public.refresh_tokens VALUES (61, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI1OTU4MDYsImV4cCI6MTc3MzIwMDYwNn0.EJE524pTKx2jBoU5iLsoPXUziu1L2YMEigVaf9K5Y4Q', true, 2, '2026-03-11 03:43:26+00', '2026-03-04 03:43:26.40829+00');
INSERT INTO public.refresh_tokens VALUES (60, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI1OTU1NjIsImV4cCI6MTc3MzIwMDM2Mn0.tpJq-VtC9FT15VzrN9KohbhXbQEVVeyYOdbIJVxjlFA', true, 2, '2026-03-11 03:39:22+00', '2026-03-04 03:39:22.459653+00');
INSERT INTO public.refresh_tokens VALUES (62, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI2NTAzNTIsImV4cCI6MTc3MzI1NTE1Mn0.nxyvn8WyjfR58hac9gU1iaSNVTAF5Sb466ESYK6pgKc', true, 2, '2026-03-11 18:52:32+00', '2026-03-04 18:52:32.243822+00');
INSERT INTO public.refresh_tokens VALUES (63, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI2NTA0MTIsImV4cCI6MTc3MzI1NTIxMn0.2kYG7LoNXX352BK6Fxcryb2JQDyqevsn5r0rhrpUWSU', true, 2, '2026-03-11 18:53:32+00', '2026-03-04 18:53:32.078986+00');
INSERT INTO public.refresh_tokens VALUES (64, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI2NTA1MTgsImV4cCI6MTc3MzI1NTMxOH0.e5rcVJA87Cd97SWO53f1topVRi8Q7WJ-98_jm74toP4', true, 2, '2026-03-11 18:55:18+00', '2026-03-04 18:55:18.687428+00');
INSERT INTO public.refresh_tokens VALUES (65, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI2NTEyODEsImV4cCI6MTc3MzI1NjA4MX0.TcS5SR_Yss_uN2Z5M4KVcfxIgn7Xhqd8K5EwKgeeO-8', true, 2, '2026-03-11 19:08:01+00', '2026-03-04 19:08:01.350475+00');
INSERT INTO public.refresh_tokens VALUES (66, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI2NTIzNTYsImV4cCI6MTc3MzI1NzE1Nn0.8t2MmCGi2GkHl3eTdTiZMwSGq7_NlNJAYsvlBJ9Fmng', true, 14, '2026-03-11 19:25:56+00', '2026-03-04 19:25:56.705481+00');
INSERT INTO public.refresh_tokens VALUES (67, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI2NTI1NzYsImV4cCI6MTc3MzI1NzM3Nn0.3zHBhXOzLCgdiD0LWOm3us2MeBvNapl0Mc-WkypyIvc', true, 1, '2026-03-11 19:29:36+00', '2026-03-04 19:29:36.301491+00');
INSERT INTO public.refresh_tokens VALUES (68, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI2NTI3ODcsImV4cCI6MTc3MzI1NzU4N30.irMpNqStiY20f3KTfFdQaFbUybsfgo_MfIKIw-3eGQo', false, 1, '2026-03-11 19:33:07+00', '2026-03-04 19:33:07.651499+00');
INSERT INTO public.refresh_tokens VALUES (69, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI2NjY0NTEsImV4cCI6MTc3MzI3MTI1MX0.Loo6g4wKa9dVZeabqEMHj9U3MPmPzXaCPB6zn77tjW4', true, 1, '2026-03-11 23:20:51+00', '2026-03-04 23:20:51.936502+00');
INSERT INTO public.refresh_tokens VALUES (70, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI2NjY0ODksImV4cCI6MTc3MzI3MTI4OX0.TX3pFJmlimbqrywB-Ol3sj9IGmek5hyQB_YEgBnYWA4', false, 1, '2026-03-11 23:21:29+00', '2026-03-04 23:21:29.67414+00');
INSERT INTO public.refresh_tokens VALUES (71, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI2NjY1NDgsImV4cCI6MTc3MzI3MTM0OH0.-X4zcbKOhmVKWM-bkmOXm-j1RjbAZr40lv99qf0rlm4', false, 1, '2026-03-11 23:22:28+00', '2026-03-04 23:22:28.674272+00');
INSERT INTO public.refresh_tokens VALUES (72, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI2NjY4MDIsImV4cCI6MTc3MzI3MTYwMn0.WZrytmWQ1gBgICB0RRFz66UsVUryRd0UokAJFqDIgPA', true, 2, '2026-03-11 23:26:42+00', '2026-03-04 23:26:42.153033+00');
INSERT INTO public.refresh_tokens VALUES (74, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI2NjY4NTksImV4cCI6MTc3MzI3MTY1OX0.5UW32LUwDF-jo1AzfK_r03YNCYcBWruxbT0CMZZm1VE', true, 1, '2026-03-11 23:27:39+00', '2026-03-04 23:27:39.754549+00');
INSERT INTO public.refresh_tokens VALUES (75, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2NjY5OTksImV4cCI6MTc3MzI3MTc5OX0.MZtKif51p8t7TVy71oyOxRoTnb0IbdpihkshPmD03dA', true, 1, '2026-03-11 23:29:59+00', '2026-03-04 23:29:59.246317+00');
INSERT INTO public.refresh_tokens VALUES (76, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI2NjcwNDAsImV4cCI6MTc3MzI3MTg0MH0.4rw1axafIHAgLZg052RpfSTXj-OkyJEzI-BdzFUJoKs', true, 14, '2026-03-11 23:30:40+00', '2026-03-04 23:30:40.528995+00');
INSERT INTO public.refresh_tokens VALUES (77, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2NjcxODAsImV4cCI6MTc3MzI3MTk4MH0.1g33UM-iLzZf3mxYO-4yOtDaE1zSsEl4joCxvtaNKt4', true, 1, '2026-03-11 23:33:00+00', '2026-03-04 23:33:00.518822+00');
INSERT INTO public.refresh_tokens VALUES (78, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2NjcyMjYsImV4cCI6MTc3MzI3MjAyNn0.Q0ads_eQFn1iIQdx0T8CPYtOPCw8QsdBB0LnagaQZXY', false, 1, '2026-03-11 23:33:46+00', '2026-03-04 23:33:46.203892+00');
INSERT INTO public.refresh_tokens VALUES (79, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2NjcyOTEsImV4cCI6MTc3MzI3MjA5MX0.n7DwNtnv98VAIKyrMie5ZdrnCvocGVM1sm-p4BNxyCA', true, 1, '2026-03-11 23:34:51+00', '2026-03-04 23:34:51.899062+00');
INSERT INTO public.refresh_tokens VALUES (80, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI2Njc0MzQsImV4cCI6MTc3MzI3MjIzNH0.b-au7t_vAdX-ud3EWXroCBMiptn1Fj6nW8-2mYce4_0', true, 14, '2026-03-11 23:37:14+00', '2026-03-04 23:37:14.553568+00');
INSERT INTO public.refresh_tokens VALUES (81, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2Njc2MjYsImV4cCI6MTc3MzI3MjQyNn0.WBLEBUx1_iNEXIS_vwwHchxnXhzJ3OQPbCOT8mcusdo', true, 1, '2026-03-11 23:40:26+00', '2026-03-04 23:40:26.266229+00');
INSERT INTO public.refresh_tokens VALUES (82, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2NzE3MDAsImV4cCI6MTc3MzI3NjUwMH0.iivkc8MNJGmqrZmACN31mvh5bOctKINuconRcsaVXQw', true, 1, '2026-03-12 00:48:20+00', '2026-03-05 00:48:20.132446+00');
INSERT INTO public.refresh_tokens VALUES (83, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2NzI4NzgsImV4cCI6MTc3MzI3NzY3OH0.pvVa4HyMq-w7RnBLOcSgQKjImED22vOo3OD4OhTunVQ', true, 1, '2026-03-12 01:07:58+00', '2026-03-05 01:07:58.354252+00');
INSERT INTO public.refresh_tokens VALUES (84, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2NzM1MjksImV4cCI6MTc3MzI3ODMyOX0.rziZwCWRCtvOIJk7gr9RBUER4-vwn746VlL7_hA28Kk', true, 1, '2026-03-12 01:18:49+00', '2026-03-05 01:18:49.970797+00');
INSERT INTO public.refresh_tokens VALUES (85, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI2NzM2MzksImV4cCI6MTc3MzI3ODQzOX0.oMOZBiwCX5zUiR_mKMoP_5HoxV9DPSsIMdB4rRnsInw', true, 14, '2026-03-12 01:20:39+00', '2026-03-05 01:20:39.438353+00');
INSERT INTO public.refresh_tokens VALUES (86, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI2NzM3NDAsImV4cCI6MTc3MzI3ODU0MH0.fbM5LrOtWU0QRT52t7Gk2xNUTIK9DNknEvH439Y4dmU', true, 14, '2026-03-12 01:22:20+00', '2026-03-05 01:22:20.125837+00');
INSERT INTO public.refresh_tokens VALUES (87, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2NzQzNDEsImV4cCI6MTc3MzI3OTE0MX0.BUmA7jayLV5LINSJR4rD-3sHudGWNVdcSbkmtICOCqc', true, 1, '2026-03-12 01:32:21+00', '2026-03-05 01:32:21.819742+00');
INSERT INTO public.refresh_tokens VALUES (88, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2NzQ0MjMsImV4cCI6MTc3MzI3OTIyM30.dTWO_Il-RuB9k89Ak_iFBsy3fzTkWejroNFipp3kIhk', false, 1, '2026-03-12 01:33:43+00', '2026-03-05 01:33:43.215506+00');
INSERT INTO public.refresh_tokens VALUES (89, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2NzQ1NzYsImV4cCI6MTc3MzI3OTM3Nn0.RYakEu2z3KC3RIju3oJt21vRHaZoeq1Gccoxzoeho9A', false, 1, '2026-03-12 01:36:16+00', '2026-03-05 01:36:16.944953+00');
INSERT INTO public.refresh_tokens VALUES (73, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI2NjY4MTgsImV4cCI6MTc3MzI3MTYxOH0.g5MUKDdy2D4W9DspzZWJOk0tVbq6joC9pUHzlG4_xZY', true, 1, '2026-03-11 23:26:58+00', '2026-03-04 23:26:58.054649+00');
INSERT INTO public.refresh_tokens VALUES (90, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI2NzQ2OTQsImV4cCI6MTc3MzI3OTQ5NH0.N4Ezn-9798_U0piTdAzXRFgVa1SWP1qocxhJN-jqn28', true, 14, '2026-03-12 01:38:14+00', '2026-03-05 01:38:14.350338+00');
INSERT INTO public.refresh_tokens VALUES (91, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2NzQ4MDAsImV4cCI6MTc3MzI3OTYwMH0.wEHeLJF-ahZ3WQgt0iQ8c--1GIDwVEl4w41DvEUQ1As', true, 1, '2026-03-12 01:40:00+00', '2026-03-05 01:40:00.300688+00');
INSERT INTO public.refresh_tokens VALUES (92, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI2NzQ5ODgsImV4cCI6MTc3MzI3OTc4OH0.Yx0oFMlMVEV2H8GG4WCQXchLEJPHO4RzmN5NJj8vrsM', true, 1, '2026-03-12 01:43:08+00', '2026-03-05 01:43:08.658893+00');
INSERT INTO public.refresh_tokens VALUES (93, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI2NzUxMDksImV4cCI6MTc3MzI3OTkwOX0.l2mdi2HvQe547xFDalKkk2N_OXMkHPpzXKLKQNmylWw', false, 14, '2026-03-12 01:45:09+00', '2026-03-05 01:45:09.36621+00');
INSERT INTO public.refresh_tokens VALUES (94, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI3NTY3NzQsImV4cCI6MTc3MzM2MTU3NH0.uyo0sA-cXB4SGcMDuuTj_xsLPOvm8yi33UuM8Z1cNRQ', true, 1, '2026-03-13 00:26:14+00', '2026-03-06 00:26:14.561707+00');
INSERT INTO public.refresh_tokens VALUES (95, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI3NTY4MDgsImV4cCI6MTc3MzM2MTYwOH0.yfJUAFypS690Bjfq8eKG4SMBn8YAldA2z3V-SEHiywA', true, 2, '2026-03-13 00:26:48+00', '2026-03-06 00:26:48.991172+00');
INSERT INTO public.refresh_tokens VALUES (96, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI3NTY4NDMsImV4cCI6MTc3MzM2MTY0M30.lIww0wctv9-FoZ_HtAsUi0oXNHIDrqzIutMtPDqoxqg', true, 14, '2026-03-13 00:27:23+00', '2026-03-06 00:27:23.799127+00');
INSERT INTO public.refresh_tokens VALUES (97, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI3NTgyMzgsImV4cCI6MTc3MzM2MzAzOH0.FTc30Ogwh_RcYLFjtMNcYU6lA74FkR0J_5uc6DCd4Ug', true, 1, '2026-03-13 00:50:38+00', '2026-03-06 00:50:38.183351+00');
INSERT INTO public.refresh_tokens VALUES (98, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI3NjA5MTUsImV4cCI6MTc3MzM2NTcxNX0.prCgRCxN2babAmVGExK3083D6PrQuf8dVVXK8wNsP1c', true, 1, '2026-03-13 01:35:15+00', '2026-03-06 01:35:15.816062+00');
INSERT INTO public.refresh_tokens VALUES (99, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzI3NjA5NDYsImV4cCI6MTc3MzM2NTc0Nn0.YcTuoLIGNcGIq9VxAAYsPC-2WcV-rYVyww74Rrst4OY', true, 14, '2026-03-13 01:35:46+00', '2026-03-06 01:35:46.438578+00');
INSERT INTO public.refresh_tokens VALUES (100, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzI3NjA5NzUsImV4cCI6MTc3MzM2NTc3NX0.H1urLVP5ku-OXwoeV_3TljQ-iW1udlit0E8Fh0Ialy4', true, 2, '2026-03-13 01:36:15+00', '2026-03-06 01:36:15.532974+00');
INSERT INTO public.refresh_tokens VALUES (101, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjb2FjaEBnbWFpbC5jb20iLCJyb2xlIjoiQ09BQ0giLCJpYXQiOjE3NzMwMDMzOTMsImV4cCI6MTc3MzYwODE5M30.eK11DDSQ6RdgcpdsVEnaGLx3o2Rio1igIyvMlWnzEM8', true, 2, '2026-03-15 20:56:33+00', '2026-03-08 20:56:33.184936+00');
INSERT INTO public.refresh_tokens VALUES (102, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzMwMDM0NTcsImV4cCI6MTc3MzYwODI1N30.PW1Lsh3sGNTXlFQMNdk34CIwMajHLyUGED4tyP-9wTM', true, 1, '2026-03-15 20:57:37+00', '2026-03-08 20:57:37.289736+00');
INSERT INTO public.refresh_tokens VALUES (103, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZGFuaWVsLmN1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJQTEFZRVIiLCJpYXQiOjE3NzMwMDM0ODUsImV4cCI6MTc3MzYwODI4NX0.W7uAN2XJK1xLE3fEpOn5VUDqNS_y58G1Mfbdn6HYVXc', true, 14, '2026-03-15 20:58:05+00', '2026-03-08 20:58:05.225008+00');
INSERT INTO public.refresh_tokens VALUES (104, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzMwMDM2NDMsImV4cCI6MTc3MzYwODQ0M30.58-A5tZmP5YlYMJe2BgtrrFAZF6ZDZoGitp12hbn3f8', true, 1, '2026-03-15 21:00:43+00', '2026-03-08 21:00:43.869057+00');
INSERT INTO public.refresh_tokens VALUES (105, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzMwMDM2OTEsImV4cCI6MTc3MzYwODQ5MX0.ieUVOy6DQ9gDAlL3dmBBQn7Sft-_Sgqm9U1QCBaa3Mg', true, 1, '2026-03-15 21:01:31+00', '2026-03-08 21:01:31.915568+00');


--
-- TOC entry 3607 (class 0 OID 16477)
-- Dependencies: 226
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.teams VALUES (1, 'USB Cali', 'Professional', true, '2026-03-02 00:47:02.046492+00', '2026-03-02 00:47:02.046492+00');
INSERT INTO public.teams VALUES (2, 'USB Cali Sub-23', 'Senior', true, '2026-03-02 01:28:11.7036+00', '2026-03-02 01:28:11.7036+00');
INSERT INTO public.teams VALUES (3, 'USB Cali Sub-20', 'Junior', true, '2026-03-02 01:28:30.807152+00', '2026-03-02 01:28:30.807152+00');


--
-- TOC entry 3611 (class 0 OID 16566)
-- Dependencies: 230
-- Data for Name: training_assignments; Type: TABLE DATA; Schema: public; Owner: -
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
-- TOC entry 3613 (class 0 OID 16586)
-- Dependencies: 232
-- Data for Name: training_plans; Type: TABLE DATA; Schema: public; Owner: -
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
-- TOC entry 3615 (class 0 OID 16598)
-- Dependencies: 234
-- Data for Name: training_progress; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.training_progress VALUES (1, '2026-03-01', 100, 'Ninguna dificultad para completar el entrenamiento.', true, NULL, 9, 9, 1, '2026-03-02 02:12:18.638975+00', NULL, '2026-03-02 02:12:18.638975+00');
INSERT INTO public.training_progress VALUES (2, '2026-03-01', 50, 'Aún sigo en proceso, no he podido culminar el entrenamiento.', true, NULL, 10, 10, 1, '2026-03-02 02:13:11.073806+00', NULL, '2026-03-02 02:13:11.073806+00');
INSERT INTO public.training_progress VALUES (3, '2026-03-01', 25, 'Ha sido un entrenamiento bastante complicado.', true, NULL, 11, 11, 1, '2026-03-02 02:13:41.651358+00', NULL, '2026-03-02 02:13:41.651358+00');
INSERT INTO public.training_progress VALUES (4, '2026-03-03', 50, 'Díficil entrenamiento pero bastante provechoso.', true, NULL, 21, 12, NULL, '2026-03-04 02:33:34.879141+00', '2026-03-04 02:33:34.877+00', '2026-03-04 02:22:18.934431+00');


--
-- TOC entry 3638 (class 0 OID 0)
-- Dependencies: 211
-- Name: clusters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.clusters_id_seq', 20, true);


--
-- TOC entry 3639 (class 0 OID 0)
-- Dependencies: 213
-- Name: coach_teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.coach_teams_id_seq', 3, true);


--
-- TOC entry 3640 (class 0 OID 0)
-- Dependencies: 215
-- Name: coaches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.coaches_id_seq', 1, true);


--
-- TOC entry 3641 (class 0 OID 0)
-- Dependencies: 217
-- Name: credentials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.credentials_id_seq', 14, true);


--
-- TOC entry 3642 (class 0 OID 0)
-- Dependencies: 227
-- Name: join_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.join_requests_id_seq', 4, true);


--
-- TOC entry 3643 (class 0 OID 0)
-- Dependencies: 209
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 8, true);


--
-- TOC entry 3644 (class 0 OID 0)
-- Dependencies: 219
-- Name: player_clusters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.player_clusters_id_seq', 20, true);


--
-- TOC entry 3645 (class 0 OID 0)
-- Dependencies: 221
-- Name: player_teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.player_teams_id_seq', 27, true);


--
-- TOC entry 3646 (class 0 OID 0)
-- Dependencies: 223
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.players_id_seq', 12, true);


--
-- TOC entry 3647 (class 0 OID 0)
-- Dependencies: 235
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 105, true);


--
-- TOC entry 3648 (class 0 OID 0)
-- Dependencies: 225
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.teams_id_seq', 3, true);


--
-- TOC entry 3649 (class 0 OID 0)
-- Dependencies: 229
-- Name: training_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.training_assignments_id_seq', 32, true);


--
-- TOC entry 3650 (class 0 OID 0)
-- Dependencies: 231
-- Name: training_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.training_plans_id_seq', 7, true);


--
-- TOC entry 3651 (class 0 OID 0)
-- Dependencies: 233
-- Name: training_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.training_progress_id_seq', 4, true);


--
-- TOC entry 3399 (class 2606 OID 16436)
-- Name: credentials PK_1e38bc43be6697cdda548ad27a6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT "PK_1e38bc43be6697cdda548ad27a6" PRIMARY KEY (id);


--
-- TOC entry 3425 (class 2606 OID 16596)
-- Name: training_plans PK_246975cb895b51662b90515a390; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_plans
    ADD CONSTRAINT "PK_246975cb895b51662b90515a390" PRIMARY KEY (id);


--
-- TOC entry 3419 (class 2606 OID 16552)
-- Name: join_requests PK_3584a09620923a5aaf7de782f0d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.join_requests
    ADD CONSTRAINT "PK_3584a09620923a5aaf7de782f0d" PRIMARY KEY (id);


--
-- TOC entry 3391 (class 2606 OID 16411)
-- Name: coach_teams PK_43798c1e7b56bc6b10660739d65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_teams
    ADD CONSTRAINT "PK_43798c1e7b56bc6b10660739d65" PRIMARY KEY (id);


--
-- TOC entry 3389 (class 2606 OID 16403)
-- Name: clusters PK_56c8e201f375e1e961dcdd6831c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clusters
    ADD CONSTRAINT "PK_56c8e201f375e1e961dcdd6831c" PRIMARY KEY (id);


--
-- TOC entry 3429 (class 2606 OID 16678)
-- Name: refresh_tokens PK_7d8bee0204106019488c4c50ffa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY (id);


--
-- TOC entry 3415 (class 2606 OID 16482)
-- Name: teams PK_7e5523774a38b08a6236d322403; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY (id);


--
-- TOC entry 3387 (class 2606 OID 16393)
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- TOC entry 3427 (class 2606 OID 16607)
-- Name: training_progress PK_97c9d74dd8beeffd749a90e411b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_progress
    ADD CONSTRAINT "PK_97c9d74dd8beeffd749a90e411b" PRIMARY KEY (id);


--
-- TOC entry 3423 (class 2606 OID 16573)
-- Name: training_assignments PK_c05e77c7a449a96eb76160a98f8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_assignments
    ADD CONSTRAINT "PK_c05e77c7a449a96eb76160a98f8" PRIMARY KEY (id);


--
-- TOC entry 3403 (class 2606 OID 16445)
-- Name: player_clusters PK_ccc7e4a2444502790521ddd42d3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_clusters
    ADD CONSTRAINT "PK_ccc7e4a2444502790521ddd42d3" PRIMARY KEY (id);


--
-- TOC entry 3411 (class 2606 OID 16473)
-- Name: players PK_de22b8fdeee0c33ab55ae71da3b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY (id);


--
-- TOC entry 3407 (class 2606 OID 16454)
-- Name: player_teams PK_e5590318e146470273cc6fa9b59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_teams
    ADD CONSTRAINT "PK_e5590318e146470273cc6fa9b59" PRIMARY KEY (id);


--
-- TOC entry 3395 (class 2606 OID 16421)
-- Name: coaches PK_eddaece1a1f1b197fa39e6864a1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaches
    ADD CONSTRAINT "PK_eddaece1a1f1b197fa39e6864a1" PRIMARY KEY (id);


--
-- TOC entry 3413 (class 2606 OID 16475)
-- Name: players REL_16fbb79bf3b1614f717c8748e7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "REL_16fbb79bf3b1614f717c8748e7" UNIQUE (credentials_id);


--
-- TOC entry 3397 (class 2606 OID 16423)
-- Name: coaches REL_5f0f42938eaed4a6f389e24819; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaches
    ADD CONSTRAINT "REL_5f0f42938eaed4a6f389e24819" UNIQUE (credentials_id);


--
-- TOC entry 3393 (class 2606 OID 16413)
-- Name: coach_teams UQ_10924594f03c0658c429784dde7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_teams
    ADD CONSTRAINT "UQ_10924594f03c0658c429784dde7" UNIQUE (coaches_id, teams_id);


--
-- TOC entry 3417 (class 2606 OID 16484)
-- Name: teams UQ_48c0c32e6247a2de155baeaf980; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT "UQ_48c0c32e6247a2de155baeaf980" UNIQUE (name);


--
-- TOC entry 3421 (class 2606 OID 16554)
-- Name: join_requests UQ_5416a8d9ec03b4658e0c8fdb1e8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.join_requests
    ADD CONSTRAINT "UQ_5416a8d9ec03b4658e0c8fdb1e8" UNIQUE (players_id, teams_id, status);


--
-- TOC entry 3409 (class 2606 OID 16456)
-- Name: player_teams UQ_bbbc070a3b8cb4f4c8db775bf49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_teams
    ADD CONSTRAINT "UQ_bbbc070a3b8cb4f4c8db775bf49" UNIQUE (players_id, teams_id);


--
-- TOC entry 3401 (class 2606 OID 16438)
-- Name: credentials UQ_c286aa8e09ecff5cc756ee83214; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT "UQ_c286aa8e09ecff5cc756ee83214" UNIQUE (email);


--
-- TOC entry 3405 (class 2606 OID 16447)
-- Name: player_clusters UQ_f0ed116b763dcc742c66a0b137f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_clusters
    ADD CONSTRAINT "UQ_f0ed116b763dcc742c66a0b137f" UNIQUE (players_id, clusters_id);


--
-- TOC entry 3435 (class 2606 OID 16515)
-- Name: player_teams FK_1285ccd0933e3b471634b5716ad; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_teams
    ADD CONSTRAINT "FK_1285ccd0933e3b471634b5716ad" FOREIGN KEY (teams_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- TOC entry 3437 (class 2606 OID 16520)
-- Name: players FK_16fbb79bf3b1614f717c8748e78; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT "FK_16fbb79bf3b1614f717c8748e78" FOREIGN KEY (credentials_id) REFERENCES public.credentials(id) ON DELETE CASCADE;


--
-- TOC entry 3445 (class 2606 OID 16643)
-- Name: training_plans FK_19991edd64daceec2844b014d44; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_plans
    ADD CONSTRAINT "FK_19991edd64daceec2844b014d44" FOREIGN KEY (created_by_coach_id) REFERENCES public.coaches(id) ON DELETE SET NULL;


--
-- TOC entry 3447 (class 2606 OID 16658)
-- Name: training_progress FK_2878dcf633823ed69e393b54b81; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_progress
    ADD CONSTRAINT "FK_2878dcf633823ed69e393b54b81" FOREIGN KEY (recorded_by_player_id) REFERENCES public.players(id) ON DELETE SET NULL;


--
-- TOC entry 3446 (class 2606 OID 16648)
-- Name: training_plans FK_4fe1780b21714d7120513d7b24c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_plans
    ADD CONSTRAINT "FK_4fe1780b21714d7120513d7b24c" FOREIGN KEY (clusters_id) REFERENCES public.clusters(id) ON DELETE SET NULL;


--
-- TOC entry 3432 (class 2606 OID 16495)
-- Name: coaches FK_5f0f42938eaed4a6f389e248193; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaches
    ADD CONSTRAINT "FK_5f0f42938eaed4a6f389e248193" FOREIGN KEY (credentials_id) REFERENCES public.credentials(id) ON DELETE CASCADE;


--
-- TOC entry 3433 (class 2606 OID 16505)
-- Name: player_clusters FK_7112a4a1451b2b223ded5bee51d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_clusters
    ADD CONSTRAINT "FK_7112a4a1451b2b223ded5bee51d" FOREIGN KEY (clusters_id) REFERENCES public.clusters(id) ON DELETE CASCADE;


--
-- TOC entry 3436 (class 2606 OID 16510)
-- Name: player_teams FK_743486d990fdaf79891c9fe6cbd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_teams
    ADD CONSTRAINT "FK_743486d990fdaf79891c9fe6cbd" FOREIGN KEY (players_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- TOC entry 3450 (class 2606 OID 16679)
-- Name: refresh_tokens FK_7c5f337a639234c9f0b2ad6b78f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "FK_7c5f337a639234c9f0b2ad6b78f" FOREIGN KEY (credentials_id) REFERENCES public.credentials(id) ON DELETE CASCADE;


--
-- TOC entry 3430 (class 2606 OID 16485)
-- Name: coach_teams FK_92b9acbffbb4238703e8f677b9b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_teams
    ADD CONSTRAINT "FK_92b9acbffbb4238703e8f677b9b" FOREIGN KEY (coaches_id) REFERENCES public.coaches(id) ON DELETE CASCADE;


--
-- TOC entry 3441 (class 2606 OID 16638)
-- Name: training_assignments FK_a2395e43d565143929965d8a08a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_assignments
    ADD CONSTRAINT "FK_a2395e43d565143929965d8a08a" FOREIGN KEY (assigned_by_coach_id) REFERENCES public.coaches(id) ON DELETE SET NULL;


--
-- TOC entry 3448 (class 2606 OID 16653)
-- Name: training_progress FK_b25d425202d361a69ba791d00c8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_progress
    ADD CONSTRAINT "FK_b25d425202d361a69ba791d00c8" FOREIGN KEY (training_assignment_id) REFERENCES public.training_assignments(id) ON DELETE CASCADE;


--
-- TOC entry 3438 (class 2606 OID 16608)
-- Name: join_requests FK_b90cbbecdf6963d6e6f3b485ac5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.join_requests
    ADD CONSTRAINT "FK_b90cbbecdf6963d6e6f3b485ac5" FOREIGN KEY (players_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- TOC entry 3439 (class 2606 OID 16618)
-- Name: join_requests FK_bafbc220d60c35fbeff3bd409e4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.join_requests
    ADD CONSTRAINT "FK_bafbc220d60c35fbeff3bd409e4" FOREIGN KEY (coaches_id) REFERENCES public.coaches(id) ON DELETE SET NULL;


--
-- TOC entry 3440 (class 2606 OID 16613)
-- Name: join_requests FK_bd98c49ccfcd87d4e653d256bfe; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.join_requests
    ADD CONSTRAINT "FK_bd98c49ccfcd87d4e653d256bfe" FOREIGN KEY (teams_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- TOC entry 3442 (class 2606 OID 16633)
-- Name: training_assignments FK_d593da100ced00abcffe9576ca8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_assignments
    ADD CONSTRAINT "FK_d593da100ced00abcffe9576ca8" FOREIGN KEY (teams_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- TOC entry 3431 (class 2606 OID 16490)
-- Name: coach_teams FK_e194b8df843692eeb19c31ca943; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_teams
    ADD CONSTRAINT "FK_e194b8df843692eeb19c31ca943" FOREIGN KEY (teams_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- TOC entry 3449 (class 2606 OID 16663)
-- Name: training_progress FK_e32549ae486def3e2f59913ae7b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_progress
    ADD CONSTRAINT "FK_e32549ae486def3e2f59913ae7b" FOREIGN KEY (recorded_by_coach_id) REFERENCES public.coaches(id) ON DELETE SET NULL;


--
-- TOC entry 3443 (class 2606 OID 16623)
-- Name: training_assignments FK_e65a401e7bf14d84b246fe550e6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_assignments
    ADD CONSTRAINT "FK_e65a401e7bf14d84b246fe550e6" FOREIGN KEY (training_plan_id) REFERENCES public.training_plans(id) ON DELETE CASCADE;


--
-- TOC entry 3434 (class 2606 OID 16500)
-- Name: player_clusters FK_e681922025a4a78f930e1037108; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_clusters
    ADD CONSTRAINT "FK_e681922025a4a78f930e1037108" FOREIGN KEY (players_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- TOC entry 3444 (class 2606 OID 16628)
-- Name: training_assignments FK_e8d5e62d7c2ef3d107f96bcbb05; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_assignments
    ADD CONSTRAINT "FK_e8d5e62d7c2ef3d107f96bcbb05" FOREIGN KEY (players_id) REFERENCES public.players(id) ON DELETE CASCADE;


-- Completed on 2026-03-08 18:06:21 -05

--
-- PostgreSQL database dump complete
--

\unrestrict UwbmJbWSZo9ICq4Q76h8qiOLG5k8FH5hayW8ckDdyF4wcQe29eObFtOA44rgRWG

