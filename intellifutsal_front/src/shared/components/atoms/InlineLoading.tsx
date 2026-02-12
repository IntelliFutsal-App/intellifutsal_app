import { FaSpinner } from "react-icons/fa";

interface InlineLoadingProps {
    title?: string;
    description?: string;
}

export const InlineLoading = ({
    title = "Cargando...",
    description = "Procesando información",
}: InlineLoadingProps) => {
    return (
        <div className="py-10 sm:py-12 text-center">
            <FaSpinner className="inline-block animate-spin w-7 h-7 text-orange-600" />
            <p className="text-gray-700 font-semibold mt-4">{title}</p>
            <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>
    );
};