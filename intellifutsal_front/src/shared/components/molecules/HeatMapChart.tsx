/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DayOfWeekPointResponse } from "@features/dashboard/types";

interface HeatmapChartProps {
    data: DayOfWeekPointResponse[] | any[];
    title: string;
}

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const HeatmapChart = ({ data, title }: HeatmapChartProps) => {
    const maxCount = Math.max(...data.map((d) => d.count), 1);

    const getIntensityColor = (count: number) => {
        const intensity = count / maxCount;

        if (intensity === 0) return "bg-gray-100";
        if (intensity < 0.25) return "bg-orange-200";
        if (intensity < 0.5) return "bg-orange-400";
        if (intensity < 0.75) return "bg-orange-600";
        return "bg-orange-700";
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

            <div className="space-y-3">
                {data.map((dayData) => {
                    const dayName = DAYS[dayData.dayOfWeek];
                    const intensity = dayData.count / maxCount;

                    return (
                        <div key={dayData.dayOfWeek} className="flex items-center gap-3">
                            <div className="w-12 text-xs font-semibold text-gray-600">
                                {dayName}
                            </div>

                            <div className="flex-1 h-10 relative group">
                                <div
                                    className={`h-full rounded-xl ${getIntensityColor(dayData.count)} transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                                    style={{ width: `${Math.max(intensity * 100, 8)}%` }}
                                />

                                {/* Tooltip */}
                                <div className="absolute left-0 top-12 hidden group-hover:block z-10">
                                    <div className="bg-gray-900/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl">
                                        <p className="text-xs font-semibold text-white">
                                            {dayData.count} actividades
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-12 text-right text-sm font-bold text-gray-800">
                                {dayData.count}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
                <span className="text-xs text-gray-600 font-medium">Menos</span>
                <div className="flex gap-1">
                    {["bg-gray-100", "bg-orange-200", "bg-orange-400", "bg-orange-600", "bg-orange-700"].map((color, idx) => (
                        <div key={idx} className={`w-4 h-4 rounded ${color}`} />
                    ))}
                </div>
                <span className="text-xs text-gray-600 font-medium">Más</span>
            </div>
        </div>
    );
};