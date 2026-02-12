import { Link } from "react-router-dom";
import { FiHome, FiSearch } from "react-icons/fi";
import { FaBrain } from "react-icons/fa";
import { Button } from "../";

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Animated 404 Number */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                        </div>
                        <h1 className="relative text-9xl font-bold bg-linear-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                            404
                        </h1>
                    </div>

                    {/* Icon and Title */}
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-2xl mb-6">
                            <FiSearch className="w-10 h-10 text-orange-600" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Página No Encontrada
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Lo sentimos, la página que buscas no existe o ha sido movida. 
                            Incluso nuestra IA no puede encontrarla.
                        </p>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 mb-10 max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            ¿Qué puedes hacer?
                        </h3>
                        <ul className="text-left text-gray-600 space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="inline-block w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></span>
                                <span>Verifica que la URL esté escrita correctamente</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="inline-block w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></span>
                                <span>Regresa a la página de inicio y navega desde allí</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="inline-block w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></span>
                                <span>Usa el menú de navegación para encontrar lo que buscas</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            to="/" 
                            size="lg"
                            icon={FiHome}
                            iconPosition="left"
                        >
                            Volver al Inicio
                        </Button>
                        <Button 
                            to="/dashboard" 
                            variant="secondary"
                            size="lg"
                            icon={FaBrain}
                            iconPosition="left"
                        >
                            Ir al Dashboard
                        </Button>
                    </div>

                    {/* Additional Help */}
                    <p className="mt-8 text-sm text-gray-500">
                        ¿Necesitas ayuda? {" "}
                        <Link to="/contact" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                            Contáctanos
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default NotFoundPage;