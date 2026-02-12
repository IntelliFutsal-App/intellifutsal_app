/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { CountByKeyResponse } from "@features/dashboard/types";

interface DonutChartProps {
    data: CountByKeyResponse[] | any[];
    title: string;
    colorMap?: Record<string, string>;
}

const DEFAULT_COLORS = [
    "#ea580c", // orange-600
    "#2563eb", // blue-600
    "#16a34a", // green-600
    "#9333ea", // purple-600
    "#dc2626", // red-600
    "#ca8a04", // yellow-600
];

const CustomTooltip = ({ active, payload, total }: any) => {
        if (active && payload && payload.length) {
            const percentage = ((payload[0].value / total) * 100).toFixed(1);
            return (
                <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600">{payload[0].name}</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">
                        {payload[0].value} ({percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

export const DonutChart = ({ data, title, colorMap }: DonutChartProps) => {
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

    const formattedData = data.map((item, index) => ({
        name: item.key || item.status || "Sin categoría",
        value: item.count,
        color: colorMap?.[item.key || item.status] || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    }));

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
                    >
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip total={total} />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry: any) => (
                            <span className="text-xs text-gray-700">
                                {value} ({entry.payload.value})
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};