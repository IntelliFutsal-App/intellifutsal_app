import { ClusterResponse, CreateClusterRequest, UpdateClusterRequest } from "../interfaces";
import { Cluster } from "../models";


export class ClusterMapper {
    static toResponse = (cluster: Cluster): ClusterResponse => {
        const clusterResponse = new ClusterResponse();

        clusterResponse.id = cluster.id;
        clusterResponse.description = cluster.description;
        clusterResponse.creationDate = cluster.creationDate;

        return clusterResponse;
    }

    static toResponseList = (clusters: Cluster[]): ClusterResponse[] => {
        return clusters.map(this.toResponse);
    }

    static toEntity = (createClusterRequest: CreateClusterRequest): Cluster => {
        const cluster = new Cluster();

        cluster.description = createClusterRequest.description;

        return cluster;
    }

    static toUpdateEntity = (updateClusterRequest: UpdateClusterRequest): Cluster => {
        const cluster = new Cluster();

        cluster.id = updateClusterRequest.id;
        
        if (updateClusterRequest.description) cluster.description = updateClusterRequest.description;

        return cluster;
    }
}