import { createClusterSchema, updateClusterSchema } from "../../dto";
import { InternalServerException, NotFoundException } from "../../exceptions";
import { ClusterResponse, CreateClusterRequest, UpdateClusterRequest } from "../../interfaces";
import { ClusterMapper } from "../../mappers";
import { ClusterRepository } from "../../repository";
import { CLUSTER_NOT_FOUND, CLUSTER_SAVE_ERROR, CLUSTER_UPDATE_ERROR, INTERNAL_SERVER_ERROR } from "../../utilities/messages.utility";
import { validateRequest } from "../../utilities/validations.utility";
import { IClusterService } from "../cluster.service.interface";


export class ClusterService implements IClusterService {
    private readonly clusterRepository: ClusterRepository;

    constructor() {
        this.clusterRepository = new ClusterRepository();
    }

    public findAll = async (): Promise<ClusterResponse[]> => {
        const clusters = await this.clusterRepository.findAll();

        return ClusterMapper.toResponseList(clusters);
    }

    public findById = async (id: number): Promise<ClusterResponse> => {
        const cluster = await this.findClusterOrThrow(id);

        return ClusterMapper.toResponse(cluster);
    }

    public save = async (createClusterRequest: CreateClusterRequest): Promise<ClusterResponse> => {
        const validatedRequest = validateRequest(createClusterSchema, createClusterRequest);
        
        const cluster = ClusterMapper.toEntity(validatedRequest);
        const savedCluster = await this.clusterRepository.save(cluster);
        if (!savedCluster) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ CLUSTER_SAVE_ERROR }`);
        
        return ClusterMapper.toResponse(savedCluster);
    }

    public update = async (updateClusterRequest: UpdateClusterRequest): Promise<ClusterResponse> => {
        await this.findClusterOrThrow(updateClusterRequest.id);
        const validatedRequest = validateRequest(updateClusterSchema, updateClusterRequest);
        
        const cluster = ClusterMapper.toUpdateEntity(validatedRequest);
        const updatedCluster = await this.clusterRepository.update(cluster);
        if (!updatedCluster) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ CLUSTER_UPDATE_ERROR }`);
        
        return ClusterMapper.toResponse(updatedCluster);
    }

    public delete = async (id: number): Promise<void> => {
        await this.findClusterOrThrow(id);
        await this.clusterRepository.delete(id);
    }

    private findClusterOrThrow = async (id: number): Promise<any> => {
        const cluster = await this.clusterRepository.findById(id);
        
        if (!cluster) throw new NotFoundException(`${ CLUSTER_NOT_FOUND }${ id }`);
        
        return cluster;
    }
}
