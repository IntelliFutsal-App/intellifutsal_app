import { AppDataSource } from "../config/app-source.config";
import { RefreshToken } from "../models";


export class RefreshTokenRepository {
    private repository = AppDataSource.getRepository(RefreshToken);

    public findAll = async () => {
        return this.repository.find();
    }

    public findById = async (id: number) => {
        return this.repository.findOne({ where: { id } });
    }

    public findActiveByToken = async (token: string) => {
        return this.repository.findOne({
            where: { token, revoked: false },
            relations: ["credential"],
        });
    }

    public findByCredentialId = async (credentialId: number) => {
        return this.repository.find({
            where: { credential: { id: credentialId } }
        });
    }

    public save = async (refreshToken: RefreshToken) => {
        return this.repository.save(refreshToken);
    }

    public revoke = async (token: string) => {
        await this.repository.update(
            { token },
            { revoked: true }
        );
    }

    public revokeAllForUser = async (credentialId: number) => {
        return this.repository.update(
            { credential: { id: credentialId } },
            { revoked: true }
        );
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}