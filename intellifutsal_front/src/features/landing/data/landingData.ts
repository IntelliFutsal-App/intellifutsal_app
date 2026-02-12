import type { IconType } from "react-icons";
import { FaBrain, FaDumbbell, FaChartLine, FaUserTie, FaUser } from "react-icons/fa";

export interface Feature {
    icon: IconType;
    title: string;
    description: string;
    highlight: string;
}

export interface Testimonial {
    name: string;
    role: string;
    text: string;
    rating: number;
    image: string;
}

export interface Benefit {
    title: string;
    description: string;
}

export interface Stat {
    value: string;
    label: string;
    sublabel: string;
}

export interface NavLink {
    label: string;
    path: string;
}

export interface FooterSection {
    title: string;
    links: { label: string; path: string }[];
}

// Features Data
export const features: Feature[] = [
    {
        icon: FaBrain,
        title: "Entrenamientos con IA",
        description: "Entrenamientos personalizados basados en datos antropométricos y físicos de cada jugador",
        highlight: "Personalización Inteligente"
    },
    {
        icon: FaDumbbell,
        title: "Adaptación Individual",
        description: "Cada entrenamiento se adapta automáticamente a las necesidades específicas de cada jugador",
        highlight: "Entrenamiento Adaptativo"
    },
    {
        icon: FaChartLine,
        title: "Recomendaciones Posicionales",
        description: "Descubre las mejores posiciones para cada jugador según sus fortalezas y debilidades",
        highlight: "Análisis Posicional"
    },
    {
        icon: FaUserTie,
        title: "Herramientas para DT",
        description: "Panel completo para directores técnicos con insights colectivos e individuales",
        highlight: "Gestión Profesional"
    }
];

// Testimonials Data
export const testimonials: Testimonial[] = [
    {
        name: "Carlos Mendoza",
        role: "Director Técnico - Club Deportivo Unidos",
        text: "IntelliFutsal transformó completamente mi metodología de entrenamiento. Los análisis de IA me permiten optimizar cada sesión según las características de mis jugadores.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
        name: "Ana Patricia Silva",
        role: "Jugadora Profesional - Selección Femenina",
        text: "Gracias a las recomendaciones personalizadas he mejorado mi rendimiento un 40%. La app identifica exactamente en qué debo enfocarme.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
    },
    {
        name: "Miguel Rodríguez",
        role: "Preparador Físico - Academia Juvenil",
        text: "El análisis antropométrico y las recomendaciones de posición han sido revolucionarios para el desarrollo de nuestros jóvenes talentos.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    }
];

// Benefits Data
export const benefits: Benefit[] = [
    {
        title: "Entrenamientos 40% más efectivos",
        description: "Gracias a la personalización con IA"
    },
    {
        title: "95% de precisión",
        description: "En recomendaciones posicionales"
    },
    {
        title: "Ahorra 60% del tiempo",
        description: "En planificación de entrenamientos"
    }
];

// Stats Data
export const stats: Stat[] = [
    {
        value: "15,000+",
        label: "Jugadores Entrenando",
        sublabel: "Con IA Personalizada"
    },
    {
        value: "1,200+",
        label: "Directores Técnicos",
        sublabel: "Optimizando Entrenamientos"
    },
    {
        value: "95%",
        label: "Precisión IA",
        sublabel: "En Recomendaciones"
    },
    {
        value: "40%",
        label: "Mejora Promedio",
        sublabel: "En Rendimiento"
    }
];

// Process Steps Data
export const processSteps = [
    {
        icon: FaUser,
        title: "Datos Físicos",
        description: "Altura, peso, envergadura, composición corporal"
    },
    {
        icon: FaBrain,
        title: "Procesamiento IA",
        description: "Análisis inteligente y recomendaciones"
    },
    {
        icon: FaDumbbell,
        title: "Entrenamiento",
        description: "Rutinas personalizadas y adaptativas"
    }
];

// Footer Data
export const footerSections: FooterSection[] = [
    {
        title: "Características",
        links: [
            { label: "Entrenamientos IA", path: "/features/ai-training" },
            { label: "Análisis Avanzado", path: "/features/analytics" },
            { label: "Recomendaciones Posicionales", path: "/features/positions" },
            { label: "Análisis Antropométrico", path: "/features/anthropometric" },
            { label: "Gestión de Equipos", path: "/features/team-management" }
        ]
    },
    {
        title: "Recursos",
        links: [
            { label: "Planes y Precios", path: "/pricing" },
            { label: "Documentación", path: "/docs" },
            { label: "API para Desarrolladores", path: "/api" },
            { label: "Centro de Ayuda", path: "/support" },
            { label: "Blog y Noticias", path: "/blog" }
        ]
    }
];

// Navigation Data
export const navLinks: NavLink[] = [
    { label: "Características", path: "/features" },
    { label: "Precios", path: "/pricing" },
    { label: "Demo", path: "/demo" }
];