interface BenefitCardProps {
    title: string;
    description: string;
}

export const BenefitCard = ({ title, description }: BenefitCardProps) => {
    return (
        <div className="flex justify-center content-center flex-col text-center p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm">
            <div className="font-bold text-orange-600 text-lg">{title}</div>
            <div className="text-xs text-gray-800 mt-1">{description}</div>
        </div>
    );
};