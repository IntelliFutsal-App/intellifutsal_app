import type { IconType } from "react-icons";
import { FaChartLine, FaDumbbell, FaRunning, FaTrophy, FaUserCircle } from "react-icons/fa";
import type { ColorType } from "./StatCard";
import { MetricTile } from "@shared/components";

interface PerformanceMetricsCardProps {
    metrics: {
        age: number;
        height: number;
        weight: number;
        bmi: number;
        highJump: number;
        thirtyMetersTime: number;
    };
}

type MetricItem = {
    label: string;
    value: string;
    icon: IconType;
    color: ColorType;
};

export const PerformanceMetricsCard = ({ metrics }: PerformanceMetricsCardProps) => {
    const metricsDisplay: MetricItem[] = [
        { label: "Edad", value: `${metrics.age} años`, icon: FaUserCircle, color: "blue" },
        { label: "Altura", value: `${metrics.height}m`, icon: FaRunning, color: "green" },
        { label: "Peso", value: `${metrics.weight}kg`, icon: FaDumbbell, color: "purple" },
        { label: "IMC", value: metrics.bmi.toFixed(1), icon: FaChartLine, color: "orange" },
        { label: "Salto Alto", value: `${metrics.highJump}cm`, icon: FaTrophy, color: "blue" },
        { label: "30 Metros", value: `${metrics.thirtyMetersTime}s`, icon: FaRunning, color: "green" }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl group overflow-hidden relative">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaChartLine className="mr-2 text-orange-600" />
                Métricas de Rendimiento
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {metricsDisplay.map((metric, idx) => (
                    <MetricTile key={idx} {...metric} />
                ))}
            </div>
        </div>
    );
};