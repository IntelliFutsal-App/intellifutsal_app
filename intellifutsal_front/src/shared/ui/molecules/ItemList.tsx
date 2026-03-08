import type { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export type ItemListColor = "green" | "orange" | "blue" | "purple";
export type ItemListLayout = "cards" | "chips";

interface ItemListProps {
    title: string;
    items: string[];
    icon?: IconType;
    color?: ItemListColor;
    emptyText?: string;
    className?: string;
    layout?: ItemListLayout;
}

const STYLES: Record<ItemListColor, { dot: string; bg: string; border: string; icon: string; chipBg: string; chipBorder: string; chipText: string }> = {
    green: {
        dot: "bg-green-500",
        bg: "from-green-50 to-green-100/50",
        border: "border-green-200",
        icon: "text-green-600",
        chipBg: "from-green-100 to-green-50",
        chipBorder: "border-green-200",
        chipText: "text-green-800",
    },
    orange: {
        dot: "bg-orange-500",
        bg: "from-orange-50 to-orange-100/50",
        border: "border-orange-200",
        icon: "text-orange-600",
        chipBg: "from-orange-100 to-orange-50",
        chipBorder: "border-orange-200",
        chipText: "text-orange-800",
    },
    blue: {
        dot: "bg-blue-500",
        bg: "from-blue-50 to-blue-100/50",
        border: "border-blue-200",
        icon: "text-blue-600",
        chipBg: "from-blue-100 to-blue-50",
        chipBorder: "border-blue-200",
        chipText: "text-blue-800",
    },
    purple: {
        dot: "bg-purple-500",
        bg: "from-purple-50 to-purple-100/50",
        border: "border-purple-200",
        icon: "text-purple-600",
        chipBg: "from-purple-100 to-purple-50",
        chipBorder: "border-purple-200",
        chipText: "text-purple-800",
    },
};

export const ItemList = ({
    title,
    items,
    icon: Icon,
    color = "green",
    emptyText = "No hay información disponible",
    className = "",
    layout = "cards",
}: ItemListProps) => {
    const s = STYLES[color];

    return (
        <div className={twMerge("", className)}>
            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                <span className={twMerge("w-2 h-2 rounded-full mr-2", s.dot)} />
                {title}
            </h4>

            {items.length === 0 ? (
                <p className="text-sm text-gray-500 italic">{emptyText}</p>
            ) : layout === "chips" ? (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, idx) => (
                        <span
                            key={`${title}-${idx}`}
                            className={twMerge(
                                `bg-linear-to-r ${s.chipBg} border ${s.chipBorder} px-3 py-1.5 rounded-lg text-xs font-semibold ${s.chipText}`
                            )}
                        >
                            {item}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map((item, idx) => (
                        <div
                            key={`${title}-${idx}`}
                            className={twMerge(
                                "flex items-start gap-2 p-3 rounded-lg border",
                                `bg-linear-to-r ${s.bg}`,
                                s.border
                            )}
                        >
                            {Icon && <Icon className={twMerge("mt-0.5 shrink-0 text-sm", s.icon)} />}
                            <span className="text-sm text-gray-700 font-medium leading-snug">{item}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};