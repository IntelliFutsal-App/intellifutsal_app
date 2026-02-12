import { footerSections } from "@features/landing/data/landingData";
import { Link } from "react-router-dom";
import { Logo } from "../atoms";

export const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-navy-800/50 to-orange-900/20"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid md:grid-cols-4 gap-12">
                    <div className="col-span-2">
                        <Logo size="lg" dark={true} />
                        <p className="text-gray-300 mb-6 text-lg leading-relaxed max-w-md mt-6">
                            La plataforma de entrenamiento de fútbol sala más avanzada del mundo.
                            Potenciada por Inteligencia Artificial para maximizar el rendimiento de jugadores y equipos.
                        </p>
                    </div>

                    {footerSections.map((section, index) => (
                        <div key={index}>
                            <h4 className="font-bold text-lg mb-6 text-white">{section.title}</h4>
                            <ul className="space-y-3 text-gray-300">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link to={link.path} className="hover:text-orange-400 transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-navy-700/50 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 mb-4 md:mb-0">
                            &copy; 2025 IntelliFutsal. Todos los derechos reservados.
                            <span className="ml-2 text-orange-400">Powered by AI</span>
                        </p>
                        <div className="flex items-center space-x-6">
                            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Términos</Link>
                            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacidad</Link>
                            <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies</Link>
                            <div className="bg-linear-to-r from-orange-600 to-orange-700 px-3 py-1 rounded-full">
                                <span className="text-xs font-bold">v1.0 IA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};