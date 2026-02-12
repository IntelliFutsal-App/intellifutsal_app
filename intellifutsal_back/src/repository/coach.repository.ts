import { AppDataSource } from "../config/app-source.config";
import { Coach } from "../models";


export class CoachRepository {
    private repository = AppDataSource.getRepository(Coach);

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

    public isAssignedToCoach = async (id: number): Promise<boolean> => {
        const count = await this.repository.count({
            where: { credential: { id } }
        });
        
        return count > 0;
    }

    public findCredentialIdByCoachId = async (coachId: number): Promise<number | null> => {
        const row = await this.repository
            .createQueryBuilder("co")
            .innerJoin("co.credential", "c")
            .select("c.id", "credentialId")
            .where("co.id = :coachId", { coachId })
            .andWhere("c.status = true")
            .getRawOne();

        return row?.credentialId ?? null;
    };

    public save = async (coach: Coach) => {
        return this.repository.save(coach);
    }

    public update = async (coach: Coach) => {
        const { id, ...rest } = coach;

        await this.repository.update({ id }, rest);

        return this.findByIdIncludingInactive(id);
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}