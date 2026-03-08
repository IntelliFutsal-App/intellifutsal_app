import { FiClock } from "react-icons/fi";
import { MinimalLayout } from "@shared/layouts";

export const CoachPendingApprovalPage = () => {
    return (
        <MinimalLayout>
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="max-w-2xl text-center">
                    <div className="p-6 bg-yellow-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <FiClock className="w-12 h-12 text-yellow-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Solicitud Pendiente
                    </h1>

                    <p className="text-lg text-gray-600 mb-8">
                        Tu solicitud para convertirte en entrenador ha sido recibida y está pendiente de aprobación por nuestro equipo.
                        Te notificaremos cuando sea aprobada.
                    </p>
                </div>
            </div>
        </MinimalLayout>
    );
};

export default CoachPendingApprovalPage;