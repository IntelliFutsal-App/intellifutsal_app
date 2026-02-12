import { Footer, Navbar } from "@shared/components";
import { CTASection, FeaturesSection, HeroSection, StatsSection, TestimonialsSection } from "../components";
import { useLandingAnimations } from "../hooks/useLandingAnimation";

export const LandingPage = () => {
    const { isVisible, currentFeature, currentTestimonial } = useLandingAnimations();

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <HeroSection isVisible={isVisible} />
            <FeaturesSection currentFeature={currentFeature} />
            <StatsSection />
            <TestimonialsSection currentTestimonial={currentTestimonial} />
            <CTASection />
            <Footer />
        </div>
    );
};

export default LandingPage;