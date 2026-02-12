import { Outlet, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaBrain, FaChartLine, FaUsers, FaTrophy } from "react-icons/fa";
import { useState, useEffect } from "react";

export const AuthLayout = () => {
    const location = useLocation();
    const isRegisterPage = location.pathname.includes("sign-up");
    
    const [isVisible, setIsVisible] = useState(false);
    const [currentCard, setCurrentCard] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 0);
        
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const cardInterval = setInterval(() => {
            setCurrentCard((prev) => (prev + 1) % 3);
        }, 3000);

        return () => clearInterval(cardInterval);
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50/50 to-transparent flex">
            {/* Left Side - Form */}
            <div className={`
                flex-1 flex flex-col px-4 sm:px-6 lg:px-20 xl:px-24 overflow-y-auto
                ${isRegisterPage ? "justify-center pt-12 pb-12" : "justify-center py-12"}
            `}>
                <div className={`mx-auto w-full ${isRegisterPage ? "max-w-6xl" : "max-w-md"}`}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 mb-8 group">
                        <img
                            src="/icon.png"
                            alt="IntelliFutsal Logo"
                            className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                        <h1 className="text-2xl font-display font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            IntelliFutsal
                        </h1>
                    </Link>

                    {/* Content */}
                    <Outlet />
                </div>
            </div>

            {/* Right Side - Visual Experience */}
            <div className="hidden lg:block relative w-0 flex-1">
                <div className="sticky top-0 h-screen overflow-hidden">
                    {/* Soft Orange Gradient Background */}
                    <div className="absolute inset-0 bg-linear-to-br from-orange-400 via-orange-500 to-orange-600"></div>
                    
                    {/* Warm Overlay - Creates depth */}
                    <div className="absolute inset-0 bg-linear-to-tr from-orange-600/30 via-transparent to-yellow-400/20"></div>
                    
                    {/* Animated Background Blobs */}
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl animate-pulse delay-150"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-400/15 rounded-full blur-3xl animate-pulse delay-300"></div>
                    
                    {/* Subtle Dot Pattern */}
                    <div className="absolute inset-0 opacity-[0.04]">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                            backgroundSize: '24px 24px'
                        }}></div>
                    </div>

                    {/* Content Container */}
                    <div className={`relative h-full flex flex-col justify-center items-center p-12 text-white transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Main Message */}
                        <div className="text-center mb-12 space-y-4">
                            <div className={`inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                                <FaBrain className="text-white animate-pulse" />
                                <span className="text-sm font-semibold">Powered by AI</span>
                            </div>
                            
                            <h2 className={`text-5xl font-bold leading-tight mb-6 transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                Entrena más
                                <br />
                                <span className="text-yellow-100 drop-shadow-lg">
                                    Inteligente
                                </span>
                            </h2>
                            
                            <p className={`text-xl text-white/90 max-w-md mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                Únete a la revolución del fútbol sala impulsada por Inteligencia Artificial
                            </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-8">
                            <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transition-all duration-500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${currentCard === 0 ? 'ring-2 ring-white/50 bg-white/15 shadow-xl' : ''} hover:bg-white/15 hover:border-white/30 group cursor-default`}>
                                <div className={`w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${currentCard === 0 ? 'scale-110' : ''}`}>
                                    <FaChartLine className="text-2xl text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Análisis IA</h3>
                                <p className="text-sm text-white/80">Datos antropométricos inteligentes</p>
                            </div>

                            <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transition-all duration-500 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${currentCard === 1 ? 'ring-2 ring-white/50 bg-white/15 shadow-xl' : ''} hover:bg-white/15 hover:border-white/30 group cursor-default`}>
                                <div className={`w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${currentCard === 1 ? 'scale-110' : ''}`}>
                                    <FaUsers className="text-2xl text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Equipos Pro</h3>
                                <p className="text-sm text-white/80">Gestión avanzada de jugadores</p>
                            </div>

                            <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transition-all duration-500 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${currentCard === 2 ? 'ring-2 ring-white/50 bg-white/15 shadow-xl' : ''} hover:bg-white/15 hover:border-white/30 col-span-2 group cursor-default`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${currentCard === 2 ? 'scale-110' : ''}`}>
                                        <FaTrophy className="text-2xl text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Resultados Comprobados</h3>
                                        <p className="text-sm text-white/80">+40% mejora en rendimiento promedio</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats with Stagger Animation */}
                        <div className={`flex items-center justify-center gap-8 text-center transition-all duration-700 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                            <div className="transition-transform hover:scale-110 duration-300">
                                <div className="text-3xl font-bold mb-1 text-white drop-shadow-lg">5K+</div>
                                <div className="text-sm text-white/80">Jugadores</div>
                            </div>
                            <div className="w-px h-12 bg-white/30"></div>
                            <div className="transition-transform hover:scale-110 duration-300">
                                <div className="text-3xl font-bold mb-1 text-white drop-shadow-lg">95%</div>
                                <div className="text-sm text-white/80">Precisión IA</div>
                            </div>
                            <div className="w-px h-12 bg-white/30"></div>
                            <div className="transition-transform hover:scale-110 duration-300">
                                <div className="text-3xl font-bold mb-1 text-white drop-shadow-lg">200+</div>
                                <div className="text-sm text-white/80">Equipos</div>
                            </div>
                        </div>

                        {/* Footer Badge */}
                        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                            <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <span className="text-xs font-semibold text-white">Datos encriptados y seguros</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};