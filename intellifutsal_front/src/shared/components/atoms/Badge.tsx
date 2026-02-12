import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export type BadgeVariant =
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "neutral"
    | "info";

interface BadgeProps {
    children: ReactNode;
    icon?: IconType;
    variant?: BadgeVariant;
    className?: string;
}

export const Badge = ({
    children,
    icon: Icon,
    variant = "primary",
    className = "",
}: BadgeProps) => {
    const baseClasses =
        "inline-flex items-center gap-2 rounded-full font-medium transition-all duration-300 border group overflow-hidden relative";

    const sizeClasses = {
        primary: "px-4 py-2 text-sm",
        secondary: "px-3 py-1.5 text-xs font-bold",
        success: "px-3 py-1.5 text-xs font-semibold",
        warning: "px-3 py-1.5 text-xs font-semibold",
        danger: "px-3 py-1.5 text-xs font-semibold",
        neutral: "px-3 py-1.5 text-xs font-semibold",
        info: "px-3 py-1.5 text-xs font-semibold",
    };

    const variantClasses: Record<BadgeVariant, string> = {
        primary: "bg-orange-50 text-orange-600 border-orange-100",
        secondary: "bg-orange-500 text-white border-orange-600",
        success: "bg-green-100 text-green-800 border-green-200",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
        danger: "bg-red-100 text-red-800 border-red-200",
        neutral: "bg-gray-100 text-gray-800 border-gray-200",
        info: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
        <span
            className={twMerge(
                baseClasses,
                sizeClasses[variant],
                variantClasses[variant],
                className
            )}
        >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{children}</span>
        </span>
    );
};