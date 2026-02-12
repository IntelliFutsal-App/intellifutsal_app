import type { IconType } from "react-icons";
import { Badge } from "../atoms";

interface FeatureCardProps {
    icon: IconType;
    title: string;
    description: string;
    highlight: string;
    isActive?: boolean;
}

export const FeatureCard = ({ icon: Icon, title, description, highlight, isActive }: FeatureCardProps) => {
    return (
        <div
            className={`group bg-white/80 rounded-3xl p-8 backdrop-blur-lg border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer ${isActive ? "ring-2 ring-orange-500/50 shadow-orange-500/10" : ""
                }`}
        >
            <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon size={24} />
            </div>
            <div className="mb-4">
                <Badge variant="secondary">{highlight}</Badge>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors">
                {title}
            </h3>
            <p className="text-gray-800 leading-relaxed">
                {description}
            </p>
        </div>
    );
};