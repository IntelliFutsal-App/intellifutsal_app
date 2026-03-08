import { FaStar, FaUserCircle } from "react-icons/fa";

interface TestimonialCardProps {
    name: string;
    role: string;
    text: string;
    rating: number;
    image: string;
    isActive?: boolean;
}

export const TestimonialCard = ({ name, role, text, rating, image, isActive }: TestimonialCardProps) => {
    const hasImage = image.length > 0;

    return (
        <div
            className={`bg-white/90 rounded-3xl p-8 backdrop-blur-lg border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${isActive ? "ring-2 ring-orange-500/30 shadow-orange-500/10" : ""
                }`}
        >
            <div className="flex items-center mb-6">
                {hasImage ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center">
                        <FaUserCircle className="w-8 h-8 text-orange-500" />
                    </div>
                )}
                <div className="ml-4">
                    <h4 className="font-bold text-gray-800 text-lg">{name}</h4>
                    <p className="text-navy-600 text-sm">{role}</p>
                    {hasImage && (
                        <div className="flex mt-2">
                            {[...Array(rating)].map((_, i) => (
                                <FaStar key={i} className="text-orange-400 text-sm" />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <p className={`text-navy-600 text-lg leading-relaxed ${hasImage ? "italic" : ""}`}>
                {hasImage ? `"${text}"` : text}
            </p>
        </div>
    );
};
