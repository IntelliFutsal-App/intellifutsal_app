import { AppDataSource } from "../config/app-source.config";
import { TrainingAssignment } from "../models";
import { TrainingAssignmentStatus } from "../interfaces";


export class TrainingAssignmentRepository {
    private repository = AppDataSource.getRepository(TrainingAssignment);

    public findAll = async () => {
        return this.repository.find();
    }

    public findById = async (id: number) => {
        return this.repository.findOne({ where: { id } });
    }

    public findByPlayer = async (playerId: number) => {
        return this.repository.find({
            where: { player: { id: playerId } }
        });
    }

    public findByTeam = async (teamId: number) => {
        return this.repository.find({
            where: { team: { id: teamId } }
        });
    }

    public findByStatus = async (status: TrainingAssignmentStatus) => {
        return this.repository.find({
            where: { status }
        });
    }

    public findPlayerPending = async (playerId: number) => {
        return this.repository.find({
            where: {
                player: { id: playerId },
                status: TrainingAssignmentStatus.PENDING
            }
        });
    }

    public save = async (assignment: TrainingAssignment) => {
        return this.repository.save(assignment);
    }

    public update = async (assignment: TrainingAssignment) => {
        const { id, ...rest } = assignment;
        await this.repository.update({ id }, rest);
        return this.findById(id);
    }

    public updateStatus = async (id: number, status: TrainingAssignmentStatus) => {
        const updateData: any = { status };

        if (status === TrainingAssignmentStatus.ACTIVE)
            updateData.approvedAt = new Date();

        if (status === TrainingAssignmentStatus.CANCELLED)
            updateData.cancelledAt = new Date();

        if (status === TrainingAssignmentStatus.COMPLETED)
            updateData.endDate = new Date();

        await this.repository.update({ id }, updateData);
        return this.findById(id);
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}