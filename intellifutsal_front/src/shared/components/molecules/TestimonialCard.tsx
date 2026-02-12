import { FaStar } from "react-icons/fa";

interface TestimonialCardProps {
    name: string;
    role: string;
    text: string;
    rating: number;
    image: string;
    isActive?: boolean;
}

export const TestimonialCard = ({ name, role, text, rating, image, isActive }: TestimonialCardProps) => {
    return (
        <div
            className={`bg-white/90 rounded-3xl p-8 backdrop-blur-lg border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${isActive ? "ring-2 ring-orange-500/30 shadow-orange-500/10" : ""
                }`}
        >
            <div className="flex items-center mb-6">
                <img
                    src={image}
                    alt={name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                />
                <div className="ml-4">
                    <h4 className="font-bold text-gray-800 text-lg">{name}</h4>
                    <p className="text-navy-600 text-sm">{role}</p>
                    <div className="flex mt-2">
                        {[...Array(rating)].map((_, i) => (
                            <FaStar key={i} className="text-orange-400 text-sm" />
                        ))}
                    </div>
                </div>
            </div>
            <blockquote className="text-navy-600 italic text-lg leading-relaxed">
                "{text}"
            </blockquote>
            <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center text-sm text-navy-500">
                    <FaStar className="mr-2" />
                    <span>Verificado por IntelliFutsal IA</span>
                </div>
            </div>
        </div>
    );
};
