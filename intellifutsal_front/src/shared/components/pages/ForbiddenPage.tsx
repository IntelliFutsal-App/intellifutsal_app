import { Link, useNavigate } from "react-router-dom";
import { FiShield, FiHome, FiArrowLeft, FiMail } from "react-icons/fi";
import { Button } from "../";

export const ForbiddenPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Animated 403 Number */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 bg-red-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                        </div>
                        <h1 className="relative text-9xl font-bold bg-linear-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                            403
                        </h1>
                    </div>

                    {/* Icon and Title */}
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-2xl mb-6">
                            <FiShield className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Acceso Denegado
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            No tienes permisos para acceder a esta página. 
                            Esta sección requiere privilegios especiales.
                        </p>
                    </div>

                    {/* Information Card */}
                    <div className="bg-red-50/50 backdrop-blur-sm rounded-2xl p-8 border border-red-100 mb-10 max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Posibles razones
                        </h3>
                        <ul className="text-left text-gray-600 space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                                <span>Tu cuenta no tiene los permisos necesarios para esta sección</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                                <span>Esta funcionalidad está disponible solo para ciertos roles (entrenadores, administradores)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                                <span>Tu suscripción actual no incluye acceso a esta característica premium</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                                <span>La sesión ha expirado, intenta iniciar sesión nuevamente</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            onClick={handleGoBack}
                            variant="secondary"
                            size="lg"
                            icon={FiArrowLeft}
                            iconPosition="left"
                        >
                            Volver Atrás
                        </Button>
                        <Button 
                            to="/" 
                            size="lg"
                            icon={FiHome}
                            iconPosition="left"
                        >
                            Ir al Inicio
                        </Button>
                    </div>

                    {/* Additional Help */}
                    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <FiMail className="text-orange-600" />
                        <span>¿Crees que esto es un error? {" "}
                            <Link to="/contact" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                                Contacta a soporte
                            </Link>
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForbiddenPage;