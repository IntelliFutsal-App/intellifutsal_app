import { SectionHeader, TestimonialCard } from "@shared/components";
import { testimonials } from "../data/landingData";

interface TestimonialsSectionProps {
    currentTestimonial: number;
}

export const TestimonialsSection = ({ currentTestimonial }: TestimonialsSectionProps) => {
    return (
        <section className="py-24 bg-white/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Historias de Éxito Reales"
                    subtitle="Descubre cómo IntelliFutsal está transformando el fútbol sala"
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            {...testimonial}
                            isActive={currentTestimonial === index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};