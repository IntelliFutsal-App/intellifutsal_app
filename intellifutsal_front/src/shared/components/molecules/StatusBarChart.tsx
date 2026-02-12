/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { CountByStatusResponse } from "@features/dashboard/types";

interface StatusBarChartProps {
    data: CountByStatusResponse[] | any[];
    title: string;
    colorMap?: Record<string, string>;
}

const DEFAULT_COLOR_MAP: Record<string, string> = {
    pending: "#f59e0b", // amber-500
    approved: "#10b981", // emerald-500
    rejected: "#ef4444", // red-500
    active: "#3b82f6", // blue-500
    completed: "#22c55e", // green-500
    cancelled: "#6b7280", // gray-500
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600">{payload[0].payload.status}</p>
                <p className="text-sm font-bold text-gray-800 mt-1">
                    {payload[0].value} registros
                </p>
            </div>
        );
    }

    return null;
};

export const StatusBarChart = ({ data, title, colorMap = DEFAULT_COLOR_MAP }: StatusBarChartProps) => {
    const formattedData = data.map((item) => ({
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        count: item.count,
        color: colorMap[item.status.toLowerCase()] || "#ea580c",
    }));

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
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};