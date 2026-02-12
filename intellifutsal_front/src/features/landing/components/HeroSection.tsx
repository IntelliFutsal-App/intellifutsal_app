import { FaBrain } from "react-icons/fa";
import { Badge, Button, BenefitCard, FloatingStat } from "@shared/components";
import { benefits } from "../data/landingData";

interface HeroSectionProps {
    isVisible: boolean;
}

export const HeroSection = ({ isVisible }: HeroSectionProps) => {
    return (
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-orange-50/50 to-transparent"></div>
            <div className="max-w-7xl mx-auto relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                        <Badge icon={FaBrain}>Powered by Artificial Intelligence</Badge>

                        <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight mt-6">
                            <span className="text-gray-800 bg-clip-text">
                                Entrena con
                            </span>
                            <br />
                            <span className="bg-linear-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                                Inteligencia Artificial
                            </span>
                        </h1>

                        <p className="text-xl text-gray-800 mb-10 leading-relaxed max-w-lg">
                            Potencia tu rendimiento en fútbol sala con entrenamientos personalizados, análisis antropométrico y recomendaciones posicionales impulsadas por IA.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Button to="/auth/sign-up" size="lg">
                                Comenzar Entrenamiento
                            </Button>
                            <Button to="/demo" variant="tertiary" size="lg">
                                Ver Demo en Vivo
                            </Button>
                        </div>

                        {/* Benefits Preview */}
                        <div className="grid grid-cols-3 gap-4">
                            {benefits.map((benefit, index) => (
                                <BenefitCard key={index} {...benefit} />
                            ))}
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-200 rounded-3xl blur-3xl opacity-30"></div>
                            <div className="relative bg-white/90 rounded-3xl p-8 backdrop-blur-lg border border-gray-100 shadow-xl">
                                <div className="aspect-video bg-linear-to-br from-gray-50 to-orange-50 rounded-2xl overflow-hidden relative">
                                    <img
                                        src="https://ginesfutsal.com/wp-content/uploads/2024/10/5-Razones-por-las-que-el-Futbol-Sala-es-Perfecto-para-el-Desarrollo-de-Jovenes-Futbolistas.jpg"
                                        alt="Futsal Training with AI Analytics"
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute top-7 right-4 flex flex-row space-x-3">
                                        <FloatingStat label="Rendimiento" value="+40%" />
                                        <FloatingStat label="Precisión IA" value="95%" delay="1s" />
                                    </div>

                                    <div className="absolute bottom-4 left-4 bg-white/95 text-gray-800 p-3 rounded-xl shadow-lg backdrop-blur-sm">
                                        <div className="flex items-center space-x-2">
                                            <FaBrain />
                                            <div className="text-xs font-medium">Análisis Antropométrico</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};