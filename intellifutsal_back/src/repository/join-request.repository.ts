import { AppDataSource } from "../config/app-source.config";
import { JoinRequest } from "../models";
import { JoinRequestStatus } from "../interfaces";


export class JoinRequestRepository {
    private repository = AppDataSource.getRepository(JoinRequest);

    public findAll = async () => {
        return this.repository.find();
    }

    public findById = async (id: number) => {
        return this.repository.findOne({ where: { id } });
    }

    public findByPlayerAndTeam = async (playerId: number, teamId: number) => {
        return this.repository.findOne({
            where: {
                player: { id: playerId },
                team: { id: teamId }
            }
        });
    }

    public findPendingByTeam = async (teamId: number) => {
        return this.repository.find({
            where: {
                team: { id: teamId },
                status: JoinRequestStatus.PENDING
            }
        });
    }

    public findPendingByPlayer = async (playerId: number) => {
        return this.repository.find({
            where: {
                player: { id: playerId },
                status: JoinRequestStatus.PENDING
            }
        });
    }

    public existsPendingByPlayer = async (playerId: number): Promise<boolean> => {
        const count = await this.repository
            .createQueryBuilder("jr")
            .where("jr.players_id = :playerId", { playerId })
            .andWhere("jr.status = :status", { status: JoinRequestStatus.PENDING })
            .getCount();

        return count > 0;
    };

    public save = async (joinRequest: JoinRequest) => {
        return this.repository.save(joinRequest);
    }

    public updateStatus = async (id: number, status: JoinRequestStatus, reviewComment?: string) => {
        await this.repository.update(
            { id },
            { status, reviewComment, reviewedAt: new Date() }
        );

        return this.findById(id);
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}