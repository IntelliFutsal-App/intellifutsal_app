import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaChalkboardTeacher, FaPlus, FaSearch } from "react-icons/fa";
import { Button, DataTable, Input, ShowInactiveToggle, StatusBadge } from "@shared/components";
import { StatCard } from "./StatCard";
import { createCoachSchema, updateCoachSchema, type CoachResponse, type CreateCoachSchema, type UpdateCoachSchema } from "@features/coach";
import { formatStringDate } from "@shared/utils";
import { useCoachesManagement } from "../hooks";
import { CreateCoachModal, EditCoachModal } from "@features/admin";

export const CoachesManagementSection = () => {
    const { coaches, stats, showInactive, setShowInactive, createCoach, updateCoach, toggleStatus, deleteCoach } =
        useCoachesManagement();

    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCoach, setEditingCoach] = useState<CoachResponse | null>(null);
    const [isActing, setIsActing] = useState(false);

    const createForm = useForm<CreateCoachSchema>({
        resolver: zodResolver(createCoachSchema),
        mode: "onSubmit",
        defaultValues: {
            firstName: "",
            lastName: "",
            birthDate: "",
            expYears: 0,
            specialty: "",
        },
    });

    const updateForm = useForm<UpdateCoachSchema>({
        resolver: zodResolver(updateCoachSchema),
        mode: "onSubmit",
        defaultValues: {
            id: undefined,
            firstName: undefined,
            lastName: undefined,
            birthDate: undefined,
            expYears: undefined,
            specialty: undefined,
        },
    });

    const openCreateModal = () => {
        createForm.reset();
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        createForm.reset();
    };

    const openEditModal = (coach: CoachResponse) => {
        updateForm.reset({
            id: coach.id,
            firstName: coach.firstName ?? undefined,
            lastName: coach.lastName ?? undefined,
            birthDate: formatStringDate(coach.birthDate) ?? undefined,
            expYears: coach.expYears ?? undefined,
            specialty: coach.specialty ?? undefined,
        });
        setEditingCoach(coach);
    };

    const closeEditModal = () => {
        setEditingCoach(null);
        updateForm.reset();
    };

    const handleCreate = async (data: CreateCoachSchema) => {
        try {
            setIsActing(true);
            await createCoach({ ...data, birthDate: new Date(data.birthDate) });
            closeCreateModal();
        } finally {
            setIsActing(false);
        }
    };

    const handleUpdate = async (data: UpdateCoachSchema) => {
        try {
            setIsActing(true);
            await updateCoach({ ...data, birthDate: data.birthDate ? new Date(data.birthDate) : undefined });
            closeEditModal();
        } finally {
            setIsActing(false);
        }
    };

    const columns = useMemo(
        () => [
            { header: "ID", accessor: "id" as const, width: "80px" },
            { header: "Nombre", accessor: (r: CoachResponse) => `${r.firstName} ${r.lastName}` },
            { header: "Edad", accessor: "age" as const },
            { header: "Experiencia", accessor: (r: CoachResponse) => `${r.expYears} años` },
            { header: "Especialidad", accessor: "specialty" as const },
            { header: "Estado", accessor: (r: CoachResponse) => <StatusBadge status={r.status} /> },
            { header: "Creado", accessor: (r: CoachResponse) => formatStringDate(r.createdAt) },
        ],
        []
    );

    return (
        <>
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={FaChalkboardTeacher} label="Total" value={stats.total.toString()} color="orange" />
                    <StatCard icon={FaChalkboardTeacher} label="Activos" value={stats.active.toString()} color="blue" />
                    <StatCard
                        icon={FaChalkboardTeacher}
                        label="Exp. Promedio"
                        value={`${stats.avgExp.toString()} años`}
                        color="green"
                    />
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Gestión de Entrenadores
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Administra los entrenadores registrados en la plataforma
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-xl">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <Input
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-2">
                            <ShowInactiveToggle show={showInactive} onChange={setShowInactive} />
                            <Button
                                onClick={openCreateModal}
                                icon={FaPlus}
                                iconPosition="left"
                                disabled={isActing}
                            >
                                Crear
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                    <DataTable
                        data={coaches}
                        columns={columns}
                        getRowId={(c) => c.id}
                        getRowStatus={(c) => c.status}
                        onEdit={openEditModal}
                        onDelete={(c) => deleteCoach(c.id)}
                        onToggleStatus={(c) => toggleStatus(c.id, c.status)}
                        searchTerm={searchTerm}
                        searchKeys={["firstName", "lastName", "specialty"]}
                    />
                </div>
            </div>

            <CreateCoachModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                form={createForm}
                onSubmit={handleCreate}
                isLoading={isActing}
            />

            <EditCoachModal
                isOpen={editingCoach !== null}
                coach={editingCoach}
                onClose={closeEditModal}
                form={updateForm}
                onSubmit={handleUpdate}
                isLoading={isActing}
            />
        </>
    );
};