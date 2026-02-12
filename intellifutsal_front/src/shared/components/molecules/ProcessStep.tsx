import type { IconType } from "react-icons";

interface ProcessStepProps {
    icon: IconType;
    title: string;
    description: string;
}

export const ProcessStep = ({ icon: Icon, title, description }: ProcessStepProps) => {
    return (
        <div className="bg-white/80 p-6 rounded-2xl backdrop-blur-sm border border-gray-100">
            <div className="text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-200/50 ">
                    <Icon size={24} className="text-orange-600" />
                </div>
                <h4 className="font-bold text-orange-600 mb-2">{title}</h4>
                <p className="text-sm text-gray-800">{description}</p>
            </div>
        </div>
    );
};