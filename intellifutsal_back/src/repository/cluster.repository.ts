import { AppDataSource } from "../config/app-source.config";
import { Cluster } from "../models";


export class ClusterRepository {
    private repository = AppDataSource.getRepository(Cluster);

    public findAll = async () => {
        return this.repository.find();
    }

    public findById = async (id: number) => {
        return this.repository.findOneBy({ id });
    }

    public save = async (cluster: Cluster) => {
        return this.repository.save(cluster);
    }

    public update = async (cluster: Cluster) => {
        const { id, ...rest } = cluster;

        await this.repository.update({ id }, rest);

        return this.findById(id);
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}