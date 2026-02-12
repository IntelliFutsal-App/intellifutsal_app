import { FaCheck, FaDumbbell, FaTimes } from "react-icons/fa";
import { Badge, ItemList } from "@shared/components";

interface PhysicalProfileCardProps {
    physicalName: string;
    description: string;
    strengths: string[];
    developmentAreas: string[];
}

export const PhysicalProfileCard = ({
    physicalName,
    description,
    strengths,
    developmentAreas,
}: PhysicalProfileCardProps) => {
    return (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl overflow-hidden relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <FaDumbbell className="mr-2 text-orange-600" />
                    Perfil Físico
                </h3>

                {/* Shared Badge */}
                <Badge variant="secondary">{physicalName}</Badge>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
                {description}
            </p>

            {/* Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ItemList
                    title="Fortalezas"
                    items={strengths}
                    icon={FaCheck}
                    color="green"
                />

                <ItemList
                    title="Áreas de Desarrollo"
                    items={developmentAreas}
                    icon={FaTimes}
                    color="orange"
                />
            </div>
        </div>
    );
};