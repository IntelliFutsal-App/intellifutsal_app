/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { CountByKeyResponse } from "@features/dashboard/types";

interface HorizontalBarChartProps {
    data: CountByKeyResponse[] | any[];
    title: string;
    color?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600">{payload[0].payload.name}</p>
                <p className="text-sm font-bold text-gray-800 mt-1">{payload[0].value} registros</p>
            </div>
        );
    }

    return null;
};

export const HorizontalBarChart = ({ data, title, color = "#ea580c" }: HorizontalBarChartProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">No hay datos disponibles</p>
                    <p className="text-xs text-gray-500 mt-1">Los datos aparecerán cuando haya registros</p>
                </div>
            </div>
        );
    }

    const formattedData = data
        .map((item) => ({
            name: (item.key || item.status || "Sin categoría")
                .split(/[_\s-]/)
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" "),
            value: item.count,
        }))
        .sort((a, b) => b.value - a.value);

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={formattedData} layout="vertical" >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" stroke="#9ca3af" style={{ fontSize: "12px" }} tickLine={false} />
                    <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#9ca3af"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        tickLine={false}
                        width={150}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {formattedData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={color} opacity={1 - (index * 0.1)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};