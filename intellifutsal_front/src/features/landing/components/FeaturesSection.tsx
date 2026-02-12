import { SectionHeader, FeatureCard, ProcessStep } from "@shared/components";
import { GrTechnology } from "react-icons/gr";
import { features, processSteps } from "../data/landingData";

interface FeaturesSectionProps {
    currentFeature: number;
}

export const FeaturesSection = ({ currentFeature }: FeaturesSectionProps) => {
    return (
        <section className="py-24 bg-white/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    badge="Tecnología de Vanguardia"
                    badgeIcon={GrTechnology}
                    title="Inteligencia Artificial para Fútbol Sala"
                    subtitle="Revoluciona tu forma de entrenar con análisis antropométrico, recomendaciones personalizadas y optimización de rendimiento"
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            {...feature}
                            isActive={currentFeature === index}
                        />
                    ))}
                </div>

                {/* Interactive Feature Demo */}
                <div className="mt-20 bg-white/60 rounded-3xl p-12 border border-gray-100 backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">
                            Análisis Antropométrico Inteligente
                        </h3>
                        <p className="text-lg text-gray-800">
                            Nuestra IA analiza datos físicos y antropométricos para crear entrenamientos únicos
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {processSteps.map((step, index) => (
                            <ProcessStep key={index} {...step} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};