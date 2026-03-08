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
        name: "Para Directores Técnicos",
        role: "Gestión y análisis de equipo",
        text: "Accede a un panel completo con insights colectivos e individuales. Analiza el rendimiento de tus jugadores y optimiza tus sesiones de entrenamiento con recomendaciones basadas en IA.",
        rating: 5,
        image: ""
    },
    {
        name: "Para Jugadores",
        role: "Desarrollo personal con IA",
        text: "Recibe entrenamientos personalizados según tus datos físicos y antropométricos. Descubre tu posición ideal y trabaja en las áreas donde más puedes mejorar.",
        rating: 5,
        image: ""
    },
    {
        name: "Para Preparadores Físicos",
        role: "Planificación inteligente",
        text: "Utiliza el análisis antropométrico y las métricas de rendimiento para crear planes de desarrollo adaptados a cada jugador de tu equipo.",
        rating: 5,
        image: ""
    }
];

// Benefits Data
export const benefits: Benefit[] = [
    {
        title: "Entrenamientos con IA",
        description: "Personalizados según tus datos físicos"
    },
    {
        title: "Análisis Posicional",
        description: "Basado en datos antropométricos reales"
    },
    {
        title: "Gestión de Equipos",
        description: "Panel integral para entrenadores"
    }
];

// Stats Data
export const stats: Stat[] = [
    {
        value: "IA",
        label: "Entrenamientos Personalizados",
        sublabel: "Adaptados a cada jugador"
    },
    {
        value: "360°",
        label: "Análisis Antropométrico",
        sublabel: "Datos físicos completos"
    },
    {
        value: "DT",
        label: "Panel para Entrenadores",
        sublabel: "Insights de equipo e individuales"
    },
    {
        value: "Pos.",
        label: "Recomendación Posicional",
        sublabel: "Basada en datos reales"
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