import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { AppDataSource } from "./app-source.config";
import { aiApiRouter, authRouter, clusterRouter, coachRouter, coachTeamRouter, dashboardRouter, joinRequestRouter, playerClusterRouter, playerRouter, playerTeamRouter, profileRouter, teamRouter, trainingAssignmentRouter, trainingPlanRouter, trainingProgressRouter, userRouter } from "../routes";
import { ErrorHandler } from "../middlewares/error-handler.middleware";
import { setupSwagger } from "./swagger.config";


dotenv.config();

export class Server {
    private app: express.Application;
    private port: number;
    private path: string;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.APP_PORT || "");
        this.path = "/api/v1";
    
        this.initializeMiddleware();
        this.initializeSwagger();
        this.initializeRoutes();
        this.initializeDataSource();
    }

    private initializeMiddleware = (): void => {
        this.app.use(cors());
        this.app.use(express.static("public"));
        this.app.use(express.json());
        this.app.use(ErrorHandler.handleGlobalError);
    }

    private initializeSwagger = (): void => {
        setupSwagger(this.app);
    }

    private initializeRoutes = (): void => {
        this.app.use(`${ this.path }/ai-api`, aiApiRouter);
        this.app.use(`${ this.path }/auth`, authRouter);
        this.app.use(`${ this.path }/cluster`, clusterRouter);
        this.app.use(`${ this.path }/coach-team`, coachTeamRouter);
        this.app.use(`${ this.path }/coach`, coachRouter);
        this.app.use(`${ this.path }/dashboard`, dashboardRouter);
        this.app.use(`${ this.path }/join-request`, joinRequestRouter);
        this.app.use(`${ this.path }/player-cluster`, playerClusterRouter);
        this.app.use(`${ this.path }/player-team`, playerTeamRouter);
        this.app.use(`${ this.path }/player`, playerRouter);
        this.app.use(`${ this.path }/profile`, profileRouter);
        this.app.use(`${ this.path }/team`, teamRouter);
        this.app.use(`${ this.path }/training-assignment`, trainingAssignmentRouter);
        this.app.use(`${ this.path }/training-plan`, trainingPlanRouter);
        this.app.use(`${ this.path }/training-progress`, trainingProgressRouter);
        this.app.use(`${ this.path }/user`, userRouter);
        
        this.app.use(ErrorHandler.handleAuthError);
    }

    private initializeDataSource = async (): Promise<void> => {
        try {
            await AppDataSource.initialize();
            console.log("Data Source has been initialized!");
        } catch (error) {
            console.log(error);
        }
    }

    public startServer = (): void => {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${ this.port }`);
            console.log(`Documentation available at http://localhost:${ this.port }/api-docs`);
        });
    }
}
