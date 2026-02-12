import { AppDataSource } from "../config/app-source.config";
import { OnboardingStatus } from "../interfaces";
import { Credential } from "../models";


export class CredentialRepository {
    private repository = AppDataSource.getRepository(Credential);

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

    public findByEmail = async (email: string) => {
        return this.repository.findOne({ where: { email, status: true } });
    }

    public findByEmailExcludingId = async (email: string, excludeId?: number) => {
        const query = this.repository.createQueryBuilder("credential")
            .where("credential.email = :email", { email });
        
        if (excludeId) query.andWhere("credential.id != :id", { id: excludeId });
        
        return query.getOne();
    }

    public findByUsernameExcludingId = async (username: string, excludeId?: number) => {
        const query = this.repository.createQueryBuilder("credential")
            .where("credential.username = :username", { username });
        
        if (excludeId) query.andWhere("credential.id != :id", { id: excludeId });
        
        return query.getOne();
    }

    public updateOnboardingStatus = async (id: number, onboardingStatus: OnboardingStatus) => {
        const result = await this.repository.update({ id }, { onboardingStatus });

        return result.affected && result.affected > 0;
    }

    public save = async (credential: Credential) => {
        return this.repository.save(credential);
    }

    public update = async (credential: Credential) => {
        const { id, ...rest } = credential;

        await this.repository.update({ id }, rest);

        return this.findByIdIncludingInactive(id);
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}
