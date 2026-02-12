import { AppDataSource } from "../config/app-source.config";
import { TeamStats } from "../interfaces";
import { Team } from "../models";


export class TeamRepository {
    private repository = AppDataSource.getRepository(Team);

    public findAll = async () => {
        return this.repository.find({ where: { status: true } });
    }

    public findAllIncludingInactive = async () => {
        return this.repository.find();
    }

    public findById = async (id: number) => {
        return this.repository.findOne({ where: { id, status: true } });
    }

    public findByIds = async (ids: number[]) => {
        if (ids.length === 0) return [];

        return this.repository.createQueryBuilder("team")
            .where("team.id IN (:...ids)", { ids })
            .andWhere("team.status = true")
            .getMany();
    }

    public findByIdIncludingInactive = async (id: number) => {
        return this.repository.findOne({ where: { id } });
    }

    public findByName = async (name: string) => {
        return this.repository.findOneBy({ name });
    }

    public findByNameExcludingId = async (name: string, excludeId?: number) => {
        const query = this.repository.createQueryBuilder("team")
            .where("team.name = :name", { name });

        if (excludeId) query.andWhere("team.id != :id", { id: excludeId });

        return query.getOne();
    }

    public getTeamStats = async (teamId: number): Promise<TeamStats> => {
        const row = await AppDataSource
            .createQueryBuilder()
            .select("COUNT(pt.id)", "playerCount")
            .addSelect(
                "COALESCE(AVG(DATE_PART('year', AGE(CURRENT_DATE, p.birth_date))), 0)",
                "averageAge",
            )
            .from("player_teams", "pt")
            .innerJoin("players", "p", "p.id = pt.players_id")
            .where("pt.teams_id = :teamId", { teamId })
            .andWhere("pt.status = true")
            .andWhere("pt.exit_date IS NULL")
            .getRawOne();

        return {
            playerCount: Number(row?.playerCount ?? 0),
            averageAge: Number(row?.averageAge ?? 0),
        };
    }

    public getTeamsStats = async (teamIds: number[]): Promise<Map<number, TeamStats>> => {
        const map = new Map<number, TeamStats>();
        if (teamIds.length === 0) return map;

        const rows = await AppDataSource
            .createQueryBuilder()
            .select("pt.teams_id", "teamId")
            .addSelect("COUNT(pt.id)", "playerCount")
            .addSelect(
                "COALESCE(AVG(DATE_PART('year', AGE(CURRENT_DATE, p.birth_date))), 0)",
                "averageAge",
            )
            .from("player_teams", "pt")
            .innerJoin("players", "p", "p.id = pt.players_id")
            .where("pt.teams_id IN (:...teamIds)", { teamIds })
            .andWhere("pt.status = true")
            .andWhere("pt.exit_date IS NULL")
            .groupBy("pt.teams_id")
            .getRawMany();

        for (const r of rows) {
            const id = Number(r.teamId);
            map.set(id, {
                playerCount: Number(r.playerCount ?? 0),
                averageAge: Number(r.averageAge ?? 0),
            });
        }

        return map;
    }

    public getStatsByTeamIds = async (teamIds: number[]): Promise<Map<number, TeamStats>> => {
        const map = new Map<number, TeamStats>();
        if (teamIds.length === 0) return map;

        const rows = await this.repository.manager.query(
            `
            SELECT
                t.id AS "teamId",
                COUNT(p.id)::int AS "playerCount",
                COALESCE(AVG(DATE_PART('year', AGE(CURRENT_DATE, p.birth_date))), 0)::float AS "averageAge"
            FROM teams t
            LEFT JOIN player_teams pt
                ON pt.teams_id = t.id
                AND pt.status = true
                AND pt.exit_date IS NULL
            LEFT JOIN players p
                ON p.id = pt.players_id
                AND p.status = true
            WHERE t.id = ANY($1)
                AND t.status = true
            GROUP BY t.id
            `,
            [teamIds]
        );

        for (const r of rows) {
            const teamId = Number(r.teamId);
            map.set(teamId, {
                playerCount: Number(r.playerCount ?? 0),
                averageAge: Number(r.averageAge ?? 0),
            });
        }

        for (const id of teamIds) {
            if (!map.has(id)) map.set(id, { playerCount: 0, averageAge: 0 });
        }

        return map;
    }

    public save = async (team: Team) => {
        return this.repository.save(team);
    }

    public update = async (team: Team) => {
        const { id, ...rest } = team;

        await this.repository.update({ id }, rest);

        return this.findByIdIncludingInactive(id);
    }

    public delete = async (id: number) => {
        return this.repository.delete(id);
    }
}