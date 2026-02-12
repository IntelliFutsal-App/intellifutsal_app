import axios from "axios";
import { AiApiAnalyzeResponse, AiApiFullRecommendationsResponse, AiApiPhysicalResponse, AiApiPositionResponse, AiApiTeamAnalyzeResponse, AiApiTeamPhysicalResponse, AiApiTeamPositionsResponse, CreateClusterRequest, CreatePlayerClusterRequest, PlayerPhysicalResultsResponse, PlayerPositionResultsResponse } from "../../interfaces";
import { IAiApiService } from "../ai-api.service.interface";
import * as dotenv from "dotenv";
import { BadRequestException } from "../../exceptions";
import { AI_SERVICE_ANALYTICS_PREDICTION_ERROR, AI_SERVICE_PHYSICAL_PREDICTION_ERROR, AI_SERVICE_POSITION_PREDICTION_ERROR, AI_SERVICE_RECOMMENDATIONS_PREDICTION_ERROR, AI_SERVICE_TEAM_PHYSICAL_PREDICTION_ERROR, AI_SERVICE_TEAM_POSITION_PREDICTION_ERROR } from "../../utilities/messages.utility";
import { PlayerService } from "./player.service";
import { AiApiMapper } from "../../mappers";
import { ClusterService } from "./cluster.service";
import { PlayerClusterService } from "./player-cluster.service";
import { TeamService } from "./team.service";


dotenv.config();

export class AiApiService implements IAiApiService {
    private readonly playerService: PlayerService;
    private readonly clusterService: ClusterService;
    private readonly playerClusterService: PlayerClusterService;
    private readonly teamService: TeamService;
    private readonly apiUrl: string | undefined;

    constructor() {
        this.playerService = new PlayerService();
        this.clusterService = new ClusterService();
        this.playerClusterService = new PlayerClusterService();
        this.teamService = new TeamService();
        this.apiUrl = process.env.AI_API_URL;
    }

    public predictPosition = async (playerId: number): Promise<AiApiPositionResponse> => {
        const player = await this.playerService.findById(playerId);
        const aiApiRequest = AiApiMapper.toRequest(player);

        try {
            const response = await axios.post<AiApiPositionResponse>(
                `${ this.apiUrl }/predict-position`, 
                aiApiRequest
            );

            this.savePlayerCluster(response.data.clusterName, playerId)

            return response.data;
        } catch (error) {
            throw new BadRequestException(AI_SERVICE_POSITION_PREDICTION_ERROR);
        }
    }

    public predictPhysical = async (playerId: number): Promise<AiApiPhysicalResponse> => {
        const player = await this.playerService.findById(playerId);
        const aiApiRequest = AiApiMapper.toRequest(player);

        try {
            const response = await axios.post<AiApiPhysicalResponse>(
                `${ this.apiUrl }/predict-physical`, 
                aiApiRequest
            );

            this.savePlayerCluster(response.data.clusterName, playerId)

            return response.data;
        } catch (error) {
            throw new BadRequestException(AI_SERVICE_PHYSICAL_PREDICTION_ERROR);
        }
    }

    public analyzePrediction = async (playerId: number): Promise<AiApiAnalyzeResponse> => {
        const player = await this.playerService.findById(playerId);
        const aiApiRequest = AiApiMapper.toRequest(player);

        try {
            const response = await axios.post<AiApiAnalyzeResponse>(
                `${ this.apiUrl }/analyze`,
                aiApiRequest
            );

            return response.data;     
        } catch (error) {
            throw new BadRequestException(AI_SERVICE_ANALYTICS_PREDICTION_ERROR);
        }
    }

    public analyzeTeamPrediction = async (teamId: number): Promise<AiApiTeamAnalyzeResponse> => {
        const team = await this.teamService.findById(teamId);
        const players = await this.playerService.findByTeamId(teamId);
        const aiApiRequest = AiApiMapper.toTeamRequest(players, team.name);

        try {
            const response = await axios.post<AiApiTeamAnalyzeResponse>(
                `${ this.apiUrl }/team/analyze`, 
                aiApiRequest
            );

            return response.data;     
        } catch (error) {
            throw new BadRequestException(AI_SERVICE_ANALYTICS_PREDICTION_ERROR);
        }
    }

    public fullRecommendationsPrediction = async (playerId: number): Promise<AiApiFullRecommendationsResponse> => {
        const player = await this.playerService.findById(playerId);
        const aiApiRequest = AiApiMapper.toRequest(player);

        try {
            const response = await axios.post<AiApiFullRecommendationsResponse>(
                `${ this.apiUrl }/full-recommendations`, 
                aiApiRequest
            );

            return response.data;
        } catch (error) {
            throw new BadRequestException(AI_SERVICE_RECOMMENDATIONS_PREDICTION_ERROR);
        }
    }

    public predictTeamPositions = async (teamId: number): Promise<AiApiTeamPositionsResponse> => {
        const team = await this.teamService.findById(teamId);
        const players = await this.playerService.findByTeamId(teamId);
        const aiApiTeamRequest = AiApiMapper.toTeamRequest(players, team.name);

        try {
            const response = await axios.post<AiApiTeamPositionsResponse>(
                `${ this.apiUrl }/team/predict-positions`, 
                aiApiTeamRequest
            );
            
            this.savePlayerClusters(response.data.results)
            
            return response.data;
        } catch (error) {
            throw new BadRequestException(AI_SERVICE_TEAM_POSITION_PREDICTION_ERROR);
        }
    }

    public predictTeamPhysical = async (teamId: number): Promise<AiApiTeamPhysicalResponse> => {
        const team = await this.teamService.findById(teamId);
        const players = await this.playerService.findByTeamId(teamId);
        const aiApiTeamRequest = AiApiMapper.toTeamRequest(players, team.name);

        try {
            const response = await axios.post<AiApiTeamPhysicalResponse>(
                `${ this.apiUrl }/team/predict-physical`, 
                aiApiTeamRequest
            );

            this.savePlayerClusters(response.data.results);

            return response.data;
        } catch (error) {
            throw new BadRequestException(AI_SERVICE_TEAM_PHYSICAL_PREDICTION_ERROR);
        }            
    }

    private createCluster = (clusterDescription: string): CreateClusterRequest => {
        const cluster = new CreateClusterRequest();

        cluster.description = clusterDescription;
        
        return cluster;
    }

    private createPlayerCluster = (playerId: number, clusterId: number): CreatePlayerClusterRequest => {
        const playerCluster = new CreatePlayerClusterRequest();

        playerCluster.playerId = playerId;
        playerCluster.clusterId = clusterId;

        return playerCluster;
    }

    private savePlayerCluster = async (clusterDescription: string, playerId: number): Promise<void> => {
        const cluster = this.createCluster(clusterDescription);
        const clusterResponse = await this.clusterService.save(cluster);
        
        const playerCluster = this.createPlayerCluster(playerId, clusterResponse.id);
        await this.playerClusterService.save(playerCluster);
    }

    private savePlayerClusters = async (results: Array<PlayerPhysicalResultsResponse | PlayerPositionResultsResponse>): Promise<void> => {
        await Promise.all(results.map(async (r) => {
            const cluster = this.createCluster(r.clusterName);
            const clusterResponse = await this.clusterService.save(cluster);

            const playerCluster = this.createPlayerCluster(r.playerId, clusterResponse.id);
            await this.playerClusterService.save(playerCluster);
        }));
    }
}