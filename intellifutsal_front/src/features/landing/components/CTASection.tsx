import { FaBrain, FaPlay } from "react-icons/fa";
import { Button } from "@shared/components";

export const CTASection = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-gray-800 opacity-95"></div>
            <div className="absolute inset-0 bg-[url('https://de1.sportal365images.com/process/smp-bet365-images/news.bet365.es-es/21112024/49686b27-8620-4fd0-a2e8-19654eecf351.jpg')] bg-cover bg-center opacity-20"></div>
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
                <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-16 border border-white/20">
                    <h2 className="text-5xl font-bold text-white mb-8 leading-tight">
                        ¿Listo para Revolucionar
                        <br />
                        <span className="bg-linear-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">
                            tu Entrenamiento?
                        </span>
                    </h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Únete a miles de jugadores y directores técnicos que ya están potenciando su rendimiento con Inteligencia Artificial
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Button to="/auth/sign-up" variant="secondary" size="lg" icon={FaBrain} iconPosition="left">
                            Comenzar Entrenamiento IA
                        </Button>
                        <Button to="/demo" variant="outline" size="lg" icon={FaPlay} iconPosition="left" className="border-white text-white hover:bg-white hover:text-gray-800">
                            Ver Demo Interactiva
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
