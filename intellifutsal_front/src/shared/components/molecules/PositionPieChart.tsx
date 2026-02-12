/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { PositionDistributionResponse } from "@features/dashboard/types";

interface PositionPieChartProps {
    data: PositionDistributionResponse[] | any[];
    title: string;
}

const COLORS = [
    "#ea580c", // orange-600
    "#2563eb", // blue-600
    "#16a34a", // green-600
    "#9333ea", // purple-600
    "#dc2626", // red-600
    "#ca8a04", // yellow-600
    "#0891b2", // cyan-600
    "#db2777", // pink-600
];

const CustomTooltip = ({ active, payload, total }: any) => {
    if (active && payload && payload.length) {
        const percentage = ((payload[0].value / total) * 100).toFixed(1);

        return (
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600">{payload[0].name}</p>
                <p className="text-sm font-bold text-gray-800 mt-1">
                    {payload[0].value} jugadores ({percentage}%)
                </p>
            </div>
        );
    }
    
    return null;
};

export const PositionPieChart = ({ data, title }: PositionPieChartProps) => {
    const formattedData = data.map((item) => ({
        name: item.position,
        value: item.count,
    }));

    const total = formattedData.reduce((sum, item) => sum + item.value, 0);

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.05) return null;

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                className="font-bold text-xs"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

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
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={formattedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {formattedData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip total={total} />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry: any) => (
                            <span className="text-sm text-gray-700">
                                {value} ({entry.payload.value})
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};