import { AppDataSource } from "../config/app-source.config";
import { PlayerTeam } from "../models";


export class PlayerTeamRepository {
    private repository = AppDataSource.getRepository(PlayerTeam);

    public findAll = async () => {
        return this.repository.find({ where: { status: true } });
    }

    public findAllIncludingInactive = async () => {
        return this.repository.find();
    }

    public findById = async (id: number) => {
        return this.repository.findOne({ where: { id, status: true } });
    }

    public findByIdIncludingInactive = async (id: number) => {
        return this.repository.findOne({ where: { id } });
    }

    public isDuplicate = async (playerId: number, teamId: number, excludeId?: number): Promise<boolean> => {
        const query = this.repository.createQueryBuilder("playerTeam")
            .innerJoinAndSelect("playerTeam.player", "player")
            .innerJoinAndSelect("playerTeam.team", "team")
            .where("player.id = :playerId", { playerId })
            .andWhere("team.id = :teamId", { teamId })
            .andWhere("playerTeam.status = true");
        
        if (excludeId) query.andWhere("playerTeam.id != :excludeId", { excludeId });
        
        const count = await query.getCount();
        return count > 0;
    }

    public findByPlayerId = async (playerId: number) => {
        return this.repository.find({
            where: { player: { id: playerId }, status: true }
        });
    }

    public findActiveTeamIdsByPlayerId = async (playerId: number): Promise<number[]> => {
        const rows = await this.repository
            .createQueryBuilder("pt")
            .select("team.id", "teamId")
            .innerJoin("pt.team", "team")
            .innerJoin("pt.player", "player")
            .where("player.id = :playerId", { playerId })
            .andWhere("pt.status = true")
            .andWhere("pt.exitDate IS NULL")
            .andWhere("team.status = true")
            .getRawMany();

        return rows.map(r => Number(r.teamId));
    }

    public existsActiveTeamForPlayer = async (playerId: number, excludeId?: number): Promise<boolean> => {
        const qb = this.repository
            .createQueryBuilder("pt")
            .where("pt.players_id = :playerId", { playerId })
            .andWhere("pt.status = true")
            .andWhere("pt.exit_date IS NULL");

        if (excludeId) qb.andWhere("pt.id != :excludeId", { excludeId });

        const count = await qb.getCount();
        return count > 0;
    }

    public save = async (playerTeam: PlayerTeam) => {
        return this.repository.save(playerTeam);
    }

    public update = async (playerTeam: PlayerTeam) => {
        const { id, ...rest } = playerTeam;

        await this.repository.update({ id }, rest);

        return this.findByIdIncludingInactive(id);
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}