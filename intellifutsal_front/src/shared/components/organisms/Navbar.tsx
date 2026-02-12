import { Link } from "react-router-dom";
import { Button, Logo } from "../atoms";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Logo />
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/auth/sign-in"
                            className="text-gray-800 hover:text-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50"
                        >
                            Iniciar Sesión
                        </Link>
                        <Button to="/auth/sign-up" size="sm">
                            Comenzar
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};