import { AppDataSource } from "../config/app-source.config";
import { TrainingProgress } from "../models";


export class TrainingProgressRepository {
    private repository = AppDataSource.getRepository(TrainingProgress);

    public findAll = async () => {
        return this.repository.find();
    }

    public findById = async (id: number) => {
        return this.repository.findOne({ where: { id } });
    }

    public findByAssignment = async (assignmentId: number) => {
        return this.repository.find({
            where: { trainingAssignment: { id: assignmentId } }
        });
    }

    public findPendingVerification = async (assignmentId: number) => {
        return this.repository.find({
            where: {
                trainingAssignment: { id: assignmentId },
                coachVerified: false
            }
        });
    }

    public findByPlayer = async (playerId: number) => {
        return this.repository.find({
            where: { recordedByPlayer: { id: playerId } }
        });
    }

    public save = async (progress: TrainingProgress) => {
        return this.repository.save(progress);
    }

    public verify = async (id: number, comment?: string) => {
        await this.repository.update(
            { id },
            {
                coachVerified: true,
                verifiedAt: new Date(),
                verificationComment: comment
            }
        );
        return this.findById(id);
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}