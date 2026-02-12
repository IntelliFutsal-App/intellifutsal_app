import { useState, useEffect } from "react";

interface UseLandingAnimationsReturn {
    isVisible: boolean;
    currentFeature: number;
    currentTestimonial: number;
}

export const useLandingAnimations = (): UseLandingAnimationsReturn => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(0);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const visTimeout = setTimeout(() => setIsVisible(true), 0);

        const featureInterval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % 4);
        }, 4000);

        const testimonialInterval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % 3);
        }, 5000);

        return () => {
            clearInterval(featureInterval);
            clearInterval(testimonialInterval);
            clearTimeout(visTimeout);
        };
    }, []);

    return { isVisible, currentFeature, currentTestimonial };
};