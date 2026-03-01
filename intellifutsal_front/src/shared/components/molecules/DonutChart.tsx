import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { CountByKeyResponse } from "@features/dashboard";

interface DonutChartProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: CountByKeyResponse[] | any[]; 
    title: string;
    colorMap?: Record<string, string>;
    labelMap?: Record<string, string>;
}

const DEFAULT_COLORS = ["#ea580c", "#2563eb", "#16a34a", "#9333ea", "#dc2626", "#ca8a04"];

const DEFAULT_LABEL_MAP: Record<string, string> = {
    ai: "IA",
    manual: "Manual",

    easy: "Fácil",
    medium: "Media",
    hard: "Difícil",

    approved: "Aprobado",
    pending: "Pendiente",
    rejected: "Rechazado",
    cancelled: "Cancelado",

    unknown: "Sin categoría",
    other: "Otro",
};

type ChartRow = {
    key: string;
    name: string;
    value: number;
    color: string;
};

const normalizeKey = (raw: string): string => {
    const s = String(raw ?? "").trim();
    const snake = s.replace(/([a-z0-9])([A-Z])/g, "$1_$2");
    const withAnd = snake.replace(/&/g, "and");
    const noDiacritics = withAnd.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleaned = noDiacritics.replace(/[^\p{L}\p{N}]+/gu, "_");

    return cleaned.replace(/^_+|_+$/g, "").toLowerCase();
};

const prettifyFallback = (key: string): string => {
    const words = key.split("_").filter(Boolean);
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const CustomTooltip = ({
    active,
    payload,
    total,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const row = payload[0]?.payload as ChartRow | undefined;
    if (!row) return null;

    const percentage = total > 0 ? ((row.value / total) * 100).toFixed(1) : "0.0";

    return (
        <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-600">{row.name}</p>
            <p className="text-sm font-bold text-gray-800 mt-1">
                {row.value} ({percentage}%)
            </p>
        </div>
    );
};

export const DonutChart = ({ data, title, colorMap, labelMap = DEFAULT_LABEL_MAP }: DonutChartProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">No hay datos disponibles</p>
                    <p className="text-xs text-gray-500 mt-1">Los datos aparecerán cuando haya registros</p>
                </div>
            </div>
        );
    }

    const total = data.reduce((sum, item) => sum + item.count, 0);

    const formattedData: ChartRow[] = data.map((item, index) => {
        const raw = String((item as unknown as { key?: string; status?: string }).key ?? (item as unknown as { status?: string }).status ?? "unknown");
        const key = normalizeKey(raw);
        const name = labelMap[key] ?? prettifyFallback(key);
        const color = (colorMap && (colorMap[raw] ?? colorMap[key])) || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

        return { key, name, value: item.count, color };
    });

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>

            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={formattedData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                    >
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${entry.key}-${index}`} fill={entry.color} />
                        ))}
                    </Pie>

                    <Tooltip content={<CustomTooltip total={total} />} />

                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value: string | number, entry) => {
                            const payload = entry?.payload as ChartRow | undefined;
                            const v = payload?.value ?? 0;
                            return <span className="text-xs text-gray-700">{String(value)} ({v})</span>;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};