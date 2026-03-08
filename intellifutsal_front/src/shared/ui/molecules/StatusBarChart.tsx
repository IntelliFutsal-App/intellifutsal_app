import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { CountByStatusResponse } from "@features/dashboard";

interface StatusBarChartProps {
    data: CountByStatusResponse[];
    title: string;
    colorMap?: Record<string, string>;
    labelMap?: Record<string, string>;
}

const DEFAULT_COLOR_MAP: Record<string, string> = {
    pending: "#f59e0b",
    approved: "#10b981",
    rejected: "#ef4444",
    active: "#3b82f6",
    completed: "#22c55e",
    cancelled: "#6b7280",
    pending_approval: "#f59e0b",
    approved_manual: "#10b981",
    rejected_manual: "#ef4444",
};

const DEFAULT_LABEL_MAP: Record<string, string> = {
    pending: "Pendiente",
    approved: "Aprobado",
    rejected: "Rechazado",
    active: "Activo",
    completed: "Completado",
    cancelled: "Cancelado",
    pending_approval: "Pendiente",
    in_progress: "En progreso",
    not_started: "No iniciado",
    done: "Completado",
};

type ChartRow = {
    key: string;
    status: string;
    count: number;
    color: string;
};

const normalizeStatusKey = (raw: string): string => {
    const s = raw.trim();
    const snake = s.replace(/([a-z0-9])([A-Z])/g, "$1_$2");

    return snake.replace(/[\s-]+/g, "_").toLowerCase();
};

const prettifyFallback = (key: string): string => {
    const words = key.split("_").filter(Boolean);
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const row = payload[0]?.payload as ChartRow | undefined;
    if (!row) return null;

    return (
        <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-600">{row.status}</p>
            <p className="text-sm font-bold text-gray-800 mt-1">{row.count} registros</p>
        </div>
    );
};

export const StatusBarChart = ({
    data,
    title,
    colorMap = DEFAULT_COLOR_MAP,
    labelMap = DEFAULT_LABEL_MAP,
}: StatusBarChartProps) => {
    const formattedData: ChartRow[] = (data ?? []).map((item) => {
        const key = normalizeStatusKey(String(item.status));
        const label = labelMap[key] ?? prettifyFallback(key);
        const color = colorMap[key] ?? "#ea580c";

        return {
            key,
            status: label,
            count: item.count,
            color,
        };
    });

    if (!data || data.length === 0) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
                <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 rounded-full p-6 mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                            />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">No hay datos disponibles</p>
                    <p className="text-xs text-gray-500 mt-1">Los datos aparecerán cuando haya actividad registrada</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="status"
                        stroke="#9ca3af"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        tickLine={false}
                    />
                    <YAxis stroke="#9ca3af" style={{ fontSize: "12px", fontWeight: 500 }} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${entry.key}-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};