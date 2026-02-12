import { AppDataSource } from "../config/app-source.config";
import { Player, PlayerTeam } from "../models";


export class PlayerRepository {
    private repository = AppDataSource.getRepository(Player);

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

    public findByCredentialId = async (credentialId: number) => {
        return this.repository.findOne({
            where: { credential: { id: credentialId }, status: true }
        });
    }

    public findByTeamId = async (teamId: number) => {
        return this.repository.createQueryBuilder("player")
            .innerJoin(
                PlayerTeam, 
                "playerTeam", 
                "playerTeam.player.id = player.id" 
            )
            .where("playerTeam.team.id = :teamId", { teamId })
            .andWhere("playerTeam.status = true")
            .andWhere("playerTeam.exitDate IS NULL")
            .getMany();
    }

    public findCredentialIdByPlayerId = async (playerId: number): Promise<number | null> => {
        const row = await this.repository
            .createQueryBuilder("player")
            .innerJoin("player.credential", "credential")
            .select("credential.id", "credentialId")
            .where("player.id = :playerId", { playerId })
            .andWhere("credential.status = true")
            .getRawOne();

        return row?.credentialId ?? null;
    }

    public isAssignedToPlayer = async (id: number): Promise<boolean> => {
        const count = await this.repository.count({
            where: { credential: { id } }
        });

        return count > 0;
    }

    public save = async (player: Player) => {
        return this.repository.save(player);
    }

    public update = async (player: Player) => {
        const { id, ...rest } = player;

        await this.repository.update({ id }, rest);

        return this.findByIdIncludingInactive(id);
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}