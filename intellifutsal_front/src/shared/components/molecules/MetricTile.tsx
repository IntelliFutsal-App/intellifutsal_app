import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export type MetricTileColor = "blue" | "green" | "purple" | "orange";

interface MetricTileProps {
    label: string;
    value: ReactNode;
    icon: IconType;
    color?: MetricTileColor;
    className?: string;
}

const COLOR_MAP: Record<MetricTileColor, { bg: string; border: string; icon: string }> = {
    blue: { bg: "from-blue-50 to-blue-100/50", border: "border-blue-200", icon: "from-blue-600 to-blue-700" },
    green: { bg: "from-green-50 to-green-100/50", border: "border-green-200", icon: "from-green-600 to-green-700" },
    purple: { bg: "from-purple-50 to-purple-100/50", border: "border-purple-200", icon: "from-purple-600 to-purple-700" },
    orange: { bg: "from-orange-50 to-orange-100/50", border: "border-orange-200", icon: "from-orange-600 to-orange-700" },
};

export const MetricTile = ({
    label,
    value,
    icon: Icon,
    color = "orange",
    className = "",
}: MetricTileProps) => {
    const c = COLOR_MAP[color];

    return (
        <div
            role="group"
            aria-label={`${label}: ${typeof value === "string" ? value : ""}`}
            className={twMerge(
                `bg-linear-to-br ${c.bg} rounded-xl p-4 border ${c.border} text-center hover:shadow-md transition-all duration-300 min-h-[88px]`,
                className
            )}
        >
            <div className={`w-10 h-10 mx-auto mb-2 bg-linear-to-br ${c.icon} rounded-lg flex items-center justify-center shadow-md`} aria-hidden>
                <Icon className="text-white text-lg" />
            </div>
            <p className="text-xs text-gray-600 mb-1 truncate">{label}</p>
            <p className="font-bold text-gray-800 truncate">{value}</p>
        </div>
    );
};