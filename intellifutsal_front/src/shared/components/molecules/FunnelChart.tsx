/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CountByKeyResponse } from "@features/dashboard/types";

interface FunnelChartProps {
    data: CountByKeyResponse[] | any[];
    title: string;
    conversionRate?: number;
}

export const FunnelChart = ({ data, title, conversionRate }: FunnelChartProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 mb-4">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">
                        No hay datos de embudo disponibles
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Los datos aparecerán cuando haya solicitudes procesadas
                    </p>
                </div>
            </div>
        );
    }

    const maxCount = Math.max(...data.map((d) => d.count), 1);

    const stageMapping: Record<string, { label: string; color: string; order: number }> = {
        PENDING: { label: "Pendientes", color: "from-amber-500 to-amber-600", order: 1 },
        APPROVED: { label: "Aprobadas", color: "from-green-500 to-green-600", order: 2 },
        REJECTED: { label: "Rechazadas", color: "from-red-500 to-red-600", order: 3 },
        JOINED: { label: "Completadas", color: "from-orange-500 to-orange-600", order: 4 },
    };

    const stageData = data
        .map((item) => {
            const mapping = stageMapping[item.key] || {
                label: item.key,
                color: "from-gray-500 to-gray-600",
                order: 999,
            };
            return {
                key: item.key,
                label: mapping.label,
                color: mapping.color,
                order: mapping.order,
                count: item.count,
                percentage: maxCount > 0 ? (item.count / maxCount) * 100 : 0,
            };
        })
        .sort((a, b) => a.order - b.order);

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                {conversionRate !== undefined && conversionRate > 0 && (
                    <div className="bg-green-100 px-3 py-1 rounded-lg">
                        <span className="text-xs font-bold text-green-700">
                            {conversionRate.toFixed(2)}% conversión
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {stageData.map((stage, index) => {
                    const isLast = index === stageData.length - 1;
                    const nextStage = !isLast ? stageData[index + 1] : null;
                    const dropoffCount = nextStage ? stage.count - nextStage.count : 0;
                    const dropoffRate = stage.count > 0 ? (dropoffCount / stage.count) * 100 : 0;

                    return (
                        <div key={stage.key}>
                            {/* Stage bar */}
                            <div className="relative group">
                                <div
                                    className={`min-h-16 rounded-xl bg-linear-to-r ${stage.color} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-between px-6 py-3`}
                                    style={{
                                        width: `${Math.max(stage.percentage, 25)}%`,
                                        minWidth: "200px",
                                    }}
                                >
                                    <div className="text-white">
                                        <p className="text-xs font-semibold opacity-90">{stage.label}</p>
                                        <p className="text-lg font-bold mt-1">{stage.count}</p>
                                    </div>
                                    <div className="text-white text-sm font-bold bg-white/20 px-2 py-1 rounded-lg">
                                        {stage.percentage.toFixed(0)}%
                                    </div>
                                </div>

                                {/* Tooltip */}
                                <div className="absolute left-0 -bottom-14 hidden group-hover:block z-10">
                                    <div className="bg-gray-900/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                                        <p className="text-xs font-semibold text-white">
                                            {stage.count} de {maxCount} ({stage.percentage.toFixed(1)}%)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {!isLast && dropoffCount > 0 && (
                                <div className="flex items-center gap-2 ml-4 mt-2 mb-1">
                                    <div className="w-0.5 h-4 bg-gray-300" />
                                    <span className="text-xs text-gray-500">
                                        -{dropoffCount} ({dropoffRate.toFixed(1)}% pérdida)
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {stageData.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                            <span className="text-gray-600">
                                Total: <span className="font-bold text-gray-800">{maxCount}</span>
                            </span>
                        </div>
                        {conversionRate !== undefined && conversionRate > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-gray-600">
                                    Tasa: <span className="font-bold text-gray-800">{conversionRate.toFixed(1)}%</span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};