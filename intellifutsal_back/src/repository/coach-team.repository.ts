import { AppDataSource } from "../config/app-source.config";
import { CoachTeam } from "../models";


export class CoachTeamRepository {
    private repository = AppDataSource.getRepository(CoachTeam);

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

    public isDuplicate = async (coachId: number, teamId: number, excludeId?: number): Promise<boolean> => {
        const query = this.repository.createQueryBuilder("coachTeam")
            .innerJoinAndSelect("coachTeam.coach", "coach")
            .innerJoinAndSelect("coachTeam.team", "team")
            .where("coach.id = :coachId", { coachId })
            .andWhere("team.id = :teamId", { teamId })
            .andWhere("coachTeam.status = true");
            
        if (excludeId) query.andWhere("coachTeam.id != :excludeId", { excludeId });
        
        const count = await query.getCount();
        return count > 0;
    }

    public findByCoachId = async (coachId: number) => {
        return this.repository.find({
            where: { coach: { id: coachId }, status: true }
        });
    }

    public findActiveTeamIdsByCoachId = async (coachId: number): Promise<number[]> => {
        const rows = await this.repository
            .createQueryBuilder("ct")
            .select("team.id", "teamId")
            .innerJoin("ct.team", "team")
            .innerJoin("ct.coach", "coach")
            .where("coach.id = :coachId", { coachId })
            .andWhere("ct.status = true")
            .andWhere("ct.endDate IS NULL")
            .andWhere("team.status = true")
            .getRawMany();

        return rows.map(r => Number(r.teamId));
    }

    public existsActiveTeamForCoach = async (coachId: number, excludeId?: number): Promise<boolean> => {
        const qb = this.repository
            .createQueryBuilder("ct")
            .where("ct.coaches_id = :coachId", { coachId })
            .andWhere("ct.status = true")
            .andWhere("ct.end_date IS NULL");

        if (excludeId) qb.andWhere("ct.id != :excludeId", { excludeId });

        const count = await qb.getCount();
        return count > 0;
    }

    public findActiveByCoachAndTeam = async (coachId: number, teamId: number) => {
        return this.repository.findOne({
            where: {
                coach: { id: coachId },
                team: { id: teamId },
                status: true
            }
        });
    }

    public save = async (coachTeam: CoachTeam) => {
        return this.repository.save(coachTeam);
    }

    public update = async (coachTeam: CoachTeam) => {
        const { id, ...rest } = coachTeam;

        await this.repository.update({ id }, rest);

        return this.findByIdIncludingInactive(id);
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}