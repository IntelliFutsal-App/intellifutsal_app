import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface StatTileProps {
    label: string;
    value: ReactNode;
    className?: string;
}

export const StatTile = ({ label, value, className = "" }: StatTileProps) => {
    return (
        <div
            className={twMerge(
                "bg-linear-to-br from-gray-50 to-orange-50/30 rounded-xl p-3 text-center border border-gray-100",
                className
            )}
        >
            <div className="font-bold text-gray-800 text-lg">{value}</div>
            <div className="text-xs text-gray-600">{label}</div>
        </div>
    );
};