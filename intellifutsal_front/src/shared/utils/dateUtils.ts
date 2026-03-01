export const formatStringDate = (date: Date | string | null | undefined) => {
    if (!date) return "—";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";

    return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
};

export const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const daysBetween = (from: Date, to: Date) => {
    const ms = to.getTime() - from.getTime();
    return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
};