import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";   
import { Cluster, Coach, CoachTeam, Credential, JoinRequest, Player, PlayerCluster, PlayerTeam, RefreshToken, Team, TrainingAssignment, TrainingPlan, TrainingProgress } from "../models";


dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const DB_HOST = NODE_ENV === "production" ? process.env.DB_PROD_HOST : process.env.DB_DEV_HOST;
const DB_PORT = NODE_ENV === "production" ? process.env.DB_PROD_PORT : process.env.DB_DEV_PORT;
const DB_USERNAME = NODE_ENV === "production" ? process.env.DB_PROD_USERNAME : process.env.DB_DEV_USERNAME;
const DB_PASSWORD = NODE_ENV === "production" ? process.env.DB_PROD_PASSWORD : process.env.DB_DEV_PASSWORD;
const DB_NAME = NODE_ENV === "production" ? process.env.DB_PROD_NAME : process.env.DB_DEV_NAME;
const DB_TYPE = NODE_ENV === "production" ? process.env.DB_PROD_TYPE : process.env.DB_DEV_TYPE;
const DEFAULT_PORT = "5432";
const DEFAULT_SYNCHRONIZE = false;
const DEFAULT_LOGGING = false;

export const AppDataSource = new DataSource({
    type: DB_TYPE as any,
    host: DB_HOST,
    port: parseInt(DB_PORT || DEFAULT_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: DEFAULT_SYNCHRONIZE,
    logging:  DEFAULT_LOGGING,
    entities: [
        Cluster,
        CoachTeam,
        Coach,
        Credential,
        JoinRequest,
        PlayerCluster,
        PlayerTeam,
        Player,
        RefreshToken,
        Team,
        TrainingAssignment,
        TrainingPlan,
        TrainingProgress
    ],
    migrations: [
        __dirname + "/../migrations/*.{js,ts}"
    ],
    migrationsTableName: "migrations",
    subscribers: []
});