import { ClusterResponse, CreateClusterRequest, UpdateClusterRequest } from "../interfaces";


export interface IClusterService {
    findAll(): Promise<ClusterResponse[]>;
    findById(id: number): Promise<ClusterResponse>;
    save(createClusterRequest: CreateClusterRequest): Promise<ClusterResponse>;
    update(updateClusterRequest: UpdateClusterRequest): Promise<ClusterResponse>;
    delete(id: number): Promise<void>;
}