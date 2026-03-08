import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { PositionDistributionResponse } from "@features/dashboard";

interface PositionPieChartProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: PositionDistributionResponse[] | any[];
    title: string;
    labelMap?: Record<string, string>;
}

const COLORS = ["#ea580c", "#2563eb", "#16a34a", "#9333ea", "#dc2626", "#ca8a04", "#0891b2", "#db2777"];

const DEFAULT_POSITION_LABELS: Record<string, string> = {
    PIVOT: "Pívot",
    WINGER: "Ala",
    FIXO: "Cierre (Fixo)",
    GOALKEEPER: "Portero",
};

type Row = {
    key: string;
    name: string;
    value: number;
};

const normalizeKey = (raw: string): string => raw.trim().replace(/\s+/g, "_").toUpperCase();

const prettifyFallback = (raw: string): string => {
    const s = raw.trim();
    if (!s) return "Sin posición";
    return s
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .toLowerCase()
        .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
};

const CustomTooltip = ({
    active,
    payload,
    total,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const row = payload[0]?.payload as Row | undefined;
    if (!row) return null;

    const percentage = total > 0 ? ((row.value / total) * 100).toFixed(1) : "0.0";

    return (
        <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-600">{row.name}</p>
            <p className="text-sm font-bold text-gray-800 mt-1">
                {row.value} jugadores ({percentage}%)
            </p>
        </div>
    );
};

export const PositionPieChart = ({ data, title, labelMap }: PositionPieChartProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
                <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 rounded-full p-6 mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">No hay datos disponibles</p>
                    <p className="text-xs text-gray-500 mt-1">Los datos aparecerán cuando haya actividad registrada</p>
                </div>
            </div>
        );
    }

    const labels = { ...DEFAULT_POSITION_LABELS, ...(labelMap ?? {}) };

    const formattedData: Row[] = data.map((item) => {
        const raw = String(item.position ?? "");
        const key = normalizeKey(raw);
        const name = labels[key] ?? prettifyFallback(raw);
        return { key, name, value: item.count };
    });

    const total = formattedData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={formattedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        dataKey="value"
                        nameKey="name"
                    >
                        {formattedData.map((row, index) => (
                            <Cell key={`cell-${row.key}-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>

                    <Tooltip content={<CustomTooltip total={total} />} />

                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value: string | number, entry) => {
                            const payload = entry?.payload as Row | undefined;
                            const v = payload?.value ?? 0;
                            return <span className="text-sm text-gray-700">{String(value)} ({v})</span>;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};