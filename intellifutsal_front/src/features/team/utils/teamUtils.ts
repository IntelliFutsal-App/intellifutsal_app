export type Option = { value: string; label: string };

export const toTeamOptions = (teams: Array<{ id: number; name?: string }>): Option[] =>
    teams.map((t) => ({ value: String(t.id), label: t.name ? `${t.name} (#${t.id})` : `Equipo #${t.id}` }));

export const toCoachOptions = (coaches: Array<{ id: number; firstName: string; lastName: string }>): Option[] =>
    coaches.map((c) => ({
        value: String(c.id),
        label: `${c.firstName} ${c.lastName}`.trim() + ` (#${c.id})`,
    }));

export const toPlayerOptions = (players: Array<{ id: number; firstName: string; lastName: string }>): Option[] =>
    players.map((p) => ({
        value: String(p.id),
        label: `${p.firstName} ${p.lastName}`.trim() + ` (#${p.id})`,
    }));

const pad = (n: number) => String(n).padStart(2, "0");

export const toDateInputValue = (d?: Date | string | null): string => {
    if (!d) return "";
    const dt = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(dt.getTime())) return "";
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
};