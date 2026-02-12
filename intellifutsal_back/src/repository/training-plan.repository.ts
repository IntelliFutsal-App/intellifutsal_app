import { AppDataSource } from "../config/app-source.config";
import { TrainingPlan } from "../models";
import { TrainingPlanStatus } from "../interfaces";


export class TrainingPlanRepository {
    private repository = AppDataSource.getRepository(TrainingPlan);

    public findAll = async () => {
        return this.repository.find();
    }

    public findById = async (id: number) => {
        return this.repository.findOne({ where: { id } });
    }

    public findByStatus = async (status: TrainingPlanStatus) => {
        return this.repository.find({
            where: { status }
        });
    }

    public findByCluster = async (clusterId: number) => {
        return this.repository.find({
            where: { cluster: { id: clusterId } }
        });
    }

    public findByCoach = async (coachId: number) => {
        return this.repository.find({
            where: { createdByCoach: { id: coachId } }
        });
    }

    public save = async (plan: TrainingPlan) => {
        return this.repository.save(plan);
    }

    public update = async (plan: TrainingPlan) => {
        const { id, ...rest } = plan;
        await this.repository.update({ id }, rest);
        return this.findById(id);
    }

    public updateStatus = async (
        id: number,
        status: TrainingPlanStatus,
        comment?: string
    ) => {
        const updateData: any = { status };

        if (status === TrainingPlanStatus.APPROVED) updateData.approvedAt = new Date();
        if (status === TrainingPlanStatus.REJECTED) updateData.rejectedAt = new Date();
        if (comment) updateData.approvalComment = comment;

        await this.repository.update({ id }, updateData);

        return this.findById(id);
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}