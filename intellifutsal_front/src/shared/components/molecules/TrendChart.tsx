/* eslint-disable @typescript-eslint/no-explicit-any */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import type { TimeSeriesPointResponse } from "@features/dashboard/types";

interface TrendChartProps {
    data: TimeSeriesPointResponse[] | any[];
    title: string;
    color?: string;
    height?: number;
    showArea?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600">{payload[0].payload.date}</p>
                <p className="text-sm font-bold text-gray-800 mt-1">
                    {payload[0].value} registros
                </p>
            </div>
        );
    }
    return null;
};

export const TrendChart = ({ data, title, color = "#ea580c", height = 280, showArea = true }: TrendChartProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
                <div className="flex flex-col items-center justify-center" style={{ height: `${height}px` }}>
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

    const formattedData = data.map((point) => ({
        date: new Date(point.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
        count: point.count,
    }));

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={height}>
                {showArea ? (
                    <AreaChart data={formattedData}>
                        <defs>
                            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
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
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke={color}
                            strokeWidth={3}
                            fill={`url(#gradient-${color})`}
                            activeDot={{ r: 6, fill: color }}
                        />
                    </AreaChart>
                ) : (
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
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
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke={color}
                            strokeWidth={3}
                            dot={{ fill: color, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};