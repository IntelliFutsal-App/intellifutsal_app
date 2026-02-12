import { AppDataSource } from "../config/app-source.config";
import { PlayerCluster } from "../models";


export class PlayerClusterRepository {
    private repository = AppDataSource.getRepository(PlayerCluster);

    public findAll = async () => {
        return this.repository.find();
    }

    public findById = async (id: number) => {
        return this.repository.findOneBy({ id });
    }

    public isDuplicate = async (playerId: number, clusterId: number, excludeId?: number): Promise<boolean> => {
        const query = this.repository.createQueryBuilder("playerCluster")
            .innerJoinAndSelect("playerCluster.player", "player")
            .innerJoinAndSelect("playerCluster.cluster", "cluster")
            .where("player.id = :playerId", { playerId })
            .andWhere("cluster.id = :clusterId", { clusterId });
            
        if (excludeId) query.andWhere("playerCluster.id != :excludeId", { excludeId });
        
        const count = await query.getCount();
        return count > 0;
    }

    public save = async (playerCluster: PlayerCluster) => {
        return this.repository.save(playerCluster);
    }

    public update = async (playerCluster: PlayerCluster) => {
        const { id, ...rest } = playerCluster;

        await this.repository.update({ id }, rest);

        return this.findById(id);
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}