import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export type InfoTileColor = "blue" | "orange" | "green" | "purple" | "gray";

interface InfoTileProps {
  title: string;
  value: ReactNode;
  icon: IconType;
  color?: InfoTileColor;
  className?: string;
  size?: "sm" | "md";
}

const COLOR_MAP: Record<
  InfoTileColor,
  { box: string; border: string; iconBg: string }
> = {
  blue: {
    box: "from-blue-50 to-blue-100",
    border: "border-blue-200",
    iconBg: "from-blue-600 to-blue-700",
  },
  orange: {
    box: "from-orange-50 to-orange-100",
    border: "border-orange-200",
    iconBg: "from-orange-600 to-orange-700",
  },
  green: {
    box: "from-green-50 to-green-100",
    border: "border-green-200",
    iconBg: "from-green-600 to-green-700",
  },
  purple: {
    box: "from-purple-50 to-purple-100",
    border: "border-purple-200",
    iconBg: "from-purple-600 to-purple-700",
  },
  gray: {
    box: "from-gray-50 to-gray-100",
    border: "border-gray-200",
    iconBg: "from-gray-700 to-gray-800",
  },
};

const SIZE_MAP = {
  sm: {
    padding: "p-4 sm:p-5",
    iconWrap: "w-12 h-12 sm:w-14 sm:h-14",
    icon: "text-lg sm:text-xl",
    title: "text-sm",
    value: "text-base sm:text-lg",
  },
  md: {
    padding: "p-5 sm:p-6",
    iconWrap: "w-14 h-14 sm:w-16 sm:h-16",
    icon: "text-xl sm:text-2xl",
    title: "text-sm",
    value: "text-base sm:text-lg",
  },
} as const;

export const InfoTile = ({
  title,
  value,
  icon: Icon,
  color = "orange",
  size = "md",
  className = "",
}: InfoTileProps) => {
  const c = COLOR_MAP[color];
  const s = SIZE_MAP[size];

  return (
    <div className={twMerge("text-center min-w-0", className)}>
      <p className={twMerge(s.title, "text-gray-600 mb-2 font-medium")}>{title}</p>

      <div className={twMerge(`bg-linear-to-br ${c.box} rounded-xl border ${c.border}`, s.padding)}>
        <div
          className={twMerge(
            `mx-auto mb-3 bg-linear-to-br ${c.iconBg} rounded-full flex items-center justify-center shadow-lg`,
            s.iconWrap
          )}
          aria-hidden
        >
          <Icon className={twMerge("text-white", s.icon)} />
        </div>

        <div
          className={twMerge("font-bold text-gray-800 truncate", s.value)}
          title={typeof value === "string" ? value : undefined}
        >
          {value}
        </div>
      </div>
    </div>
  );
};