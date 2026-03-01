export type PlayerPosition =
    | "PIVOT"
    | "WINGER"
    | "FIXO"
    | "GOALKEEPER"
    | (string & {});

export const POSITION_LABELS_ES: Record<string, string> = {
    PIVOT: "Pívot",
    WINGER: "Ala",
    FIXO: "Cierre (Fixo)",
    GOALKEEPER: "Portero",
};

const normalizePositionKey = (raw: unknown): string =>
    String(raw ?? "")
        .trim()
        .replace(/\s+/g, "_")
        .toUpperCase();

export const mapPositionToEs = (
    position: unknown,
    opts?: {
        fallback?: string;
        unknownPrefix?: string;
        customMap?: Record<string, string>;
    }
): string => {
    const key = normalizePositionKey(position);

    const fallback = opts?.fallback ?? "Sin posición";
    if (!key) return fallback;

    const dict = { ...POSITION_LABELS_ES, ...(opts?.customMap ?? {}) };

    const direct = dict[key];
    if (direct) return direct;

    const pretty = key
        .split(/[_-]+/g)
        .filter(Boolean)
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");

    return opts?.unknownPrefix ? `${opts.unknownPrefix}${pretty}` : pretty;
};