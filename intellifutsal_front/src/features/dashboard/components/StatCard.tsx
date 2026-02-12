import type { IconType } from "react-icons";
import { FaArrowRight, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

export type ColorType = "orange" | "blue" | "green" | "purple";

interface StatCardProps {
    icon: IconType;
    label: string;
    value: string | number;
    trend?: string | number;
    color?: ColorType;
    className?: string;
    "aria-label"?: string;
}

export const StatCard = ({
    icon: Icon,
    label,
    value,
    trend,
    color = "orange",
    className = "",
    "aria-label": ariaLabel,
}: StatCardProps) => {
    const COLOR_MAP: Record<
        ColorType,
        { gradient: string; glow: string; bg: string; accentText?: string }
    > = {
        orange: {
            gradient: "from-orange-600 to-orange-700",
            glow: "shadow-orange-500/20",
            bg: "from-orange-50 to-orange-100/50",
            accentText: "text-orange-600",
        },
        blue: {
            gradient: "from-blue-600 to-blue-700",
            glow: "shadow-blue-500/20",
            bg: "from-blue-50 to-blue-100/50",
            accentText: "text-blue-600",
        },
        green: {
            gradient: "from-green-600 to-green-700",
            glow: "shadow-green-500/20",
            bg: "from-green-50 to-green-100/50",
            accentText: "text-green-600",
        },
        purple: {
            gradient: "from-purple-600 to-purple-700",
            glow: "shadow-purple-500/20",
            bg: "from-purple-50 to-purple-100/50",
            accentText: "text-purple-600",
        },
    };

    const c = COLOR_MAP[color];

    // trend detection: + => positive, - => negative, otherwise neutral
    const trendStr = trend === undefined ? "" : String(trend);
    const isPositive = /^\+/.test(trendStr);
    const isNegative = /^-/.test(trendStr);

    const trendColorClass = isPositive
        ? "text-green-600"
        : isNegative
            ? "text-red-600"
            : "text-gray-600";

    const TrendIcon = isPositive ? FaArrowUp : isNegative ? FaArrowDown : FaArrowRight;

    return (
        <div
            role="group"
            aria-label={ariaLabel ?? `${label} — ${value}`}
            className={twMerge(
                `relative bg-linear-to-br ${c.bg} rounded-2xl p-5 sm:p-6 border border-white/50 shadow-lg ${c.glow} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden`,
                className
            )}
        >
            {/* Decorative glow */}
            <div
                aria-hidden
                className="absolute top-0 right-0 w-28 h-28 bg-linear-to-br from-white/40 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-500"
            />

            <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 mb-1 truncate">{label}</p>

                    <h3 className="text-2xl sm:text-3xl font-extrabold bg-linear-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1 truncate">
                        {value}
                    </h3>

                    {trend !== undefined && (
                        <p className={`text-sm font-medium flex items-center gap-2 ${trendColorClass}`}>
                            <TrendIcon className="text-sm" aria-hidden />
                            <span className="truncate">{trendStr}</span>
                        </p>
                    )}
                </div>

                <div
                    className={twMerge(
                        `shrink-0 rounded-xl p-3 sm:p-4 shadow-lg group-hover:scale-110 transition-transform duration-300 bg-linear-to-br ${c.gradient}`,
                    )}
                    aria-hidden
                >
                    <Icon className="text-white text-xl sm:text-2xl" />
                </div>
            </div>
        </div>
    );
};