import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import { FiPlus, FiSearch, FiArrowRight } from "react-icons/fi";
import { Button } from "@shared/components";
import { CreateTeamForm, JoinExistingTeamList } from "../components";

type Mode = "create" | "join" | null;

interface OptionCardProps {
    icon: IconType;
    title: string;
    description: string;
    onClick: () => void;
}

const OptionCard = ({ icon: Icon, title, description, onClick }: OptionCardProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group w-full text-left relative p-6 sm:p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-orange-500 hover:shadow-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20"
        >
            <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors shrink-0">
                    <Icon className="w-6 h-6 text-orange-600" />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {description}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                        <span>Continuar</span>
                        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </button>
    );
};

export const CoachTeamSetupPage = () => {
    const [mode, setMode] = useState<Mode>(null);
    const navigate = useNavigate();

    const options = useMemo(
        () => [
            {
                key: "create" as const,
                icon: FiPlus,
                title: "Crear Nuevo Equipo",
                description:
                    "Crea y gestiona tu propio equipo desde cero. Podrás invitar jugadores y gestionar entrenamientos.",
            },
            {
                key: "join" as const,
                icon: FiSearch,
                title: "Unirme a Equipo Existente",
                description:
                    "Busca y únete a un equipo que ya esté registrado en la plataforma.",
            },
        ],
        []
    );

    switch (mode) {
        case "create":
            return <CreateTeamForm onBack={() => setMode(null)} />;
        case "join":
            return <JoinExistingTeamList onBack={() => setMode(null)} />;
        default:
            break;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-gray-900">
                    Configura tu Equipo
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Como entrenador, puedes crear un nuevo equipo o unirte a uno existente
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {options.map((opt) => (
                    <OptionCard
                        key={opt.key}
                        icon={opt.icon}
                        title={opt.title}
                        description={opt.description}
                        onClick={() => setMode(opt.key)}
                    />
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                    className="px-0!"
                >
                    Omitir por ahora
                </Button>
            </div>
        </div>
    );
};

export default CoachTeamSetupPage;