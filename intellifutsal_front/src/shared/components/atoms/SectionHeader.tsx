import type { IconType } from "react-icons";
import { Badge } from "./Badge";

interface SectionHeaderProps {
    badge?: string;
    badgeIcon?: IconType;
    title: string;
    subtitle?: string;
    centered?: boolean;
}

export const SectionHeader = ({ badge, badgeIcon, title, subtitle, centered = true }: SectionHeaderProps) => {
    return (
        <div className={`mb-16 ${centered ? "text-center" : ""}`}>
            {badge && (
                <div className="mb-6">
                    <Badge variant="primary" icon={badgeIcon}>{badge}</Badge>
                </div>
            )}
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
};