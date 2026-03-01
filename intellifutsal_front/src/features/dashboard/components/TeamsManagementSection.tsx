import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaUsers, FaPlus, FaSearch } from "react-icons/fa";
import { Button, DataTable, Input, ShowInactiveToggle, StatusBadge } from "@shared/components";
import { StatCard } from "./StatCard";
import { useTeamsManagement } from "../hooks";
import { createTeamSchema, updateTeamSchema, type Category, type CreateTeamSchema, type TeamResponse, type UpdateTeamSchema } from "@features/team";
import { formatStringDate } from "@shared/utils";
import { CreateTeamModal, EditTeamModal } from "@features/admin";

export const TeamsManagementSection = () => {
    const { teams, stats, showInactive, setShowInactive, createTeam, updateTeam, toggleStatus, deleteTeam } =
        useTeamsManagement();

    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<TeamResponse | null>(null);
    const [isActing, setIsActing] = useState(false);

    const createForm = useForm<CreateTeamSchema>({
        resolver: zodResolver(createTeamSchema),
        defaultValues: { name: "", category: "Junior" as Category },
        mode: "onSubmit",
    });

    const updateForm = useForm<UpdateTeamSchema>({
        resolver: zodResolver(updateTeamSchema),
        defaultValues: { id: undefined, name: undefined, category: undefined },
        mode: "onSubmit",
    });

    const openCreateModal = () => {
        createForm.reset({ name: "", category: "Junior" as Category });
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        createForm.reset({ name: "", category: "Junior" as Category });
    };

    const openEditModal = (team: TeamResponse) => {
        updateForm.reset({ id: team.id, name: team.name, category: team.category });
        setEditingTeam(team);
    };

    const closeEditModal = () => {
        setEditingTeam(null);
        updateForm.reset({ id: undefined, name: undefined, category: undefined });
    };

    const handleCreate = async (data: CreateTeamSchema) => {
        try {
            setIsActing(true);
            await createTeam(data);
            closeCreateModal();
        } finally {
            setIsActing(false);
        }
    };

    const handleUpdate = async (data: UpdateTeamSchema) => {
        try {
            setIsActing(true);
            await updateTeam(data);
            closeEditModal();
        } finally {
            setIsActing(false);
        }
    };

    const columns = useMemo(
        () => [
            { header: "ID", accessor: "id" as const, width: "80px" },
            { header: "Nombre", accessor: "name" as const },
            { header: "Categoría", accessor: "category" as const },
            { header: "Jugadores", accessor: "playerCount" as const },
            { header: "Edad Promedio", accessor: (r: TeamResponse) => `${r.averageAge} años` },
            { header: "Estado", accessor: (r: TeamResponse) => <StatusBadge status={r.status} /> },
            { header: "Creado", accessor: (r: TeamResponse) => formatStringDate(r.createdAt) },
        ],
        []
    );

    return (
        <>
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <StatCard icon={FaUsers} label="Total" value={stats.total.toString()} color="orange" />
                    <StatCard icon={FaUsers} label="Activos" value={stats.active.toString()} color="blue" />
                    <StatCard icon={FaUsers} label="Total Jugadores" value={stats.totalPlayers.toString()} color="green" />
                    <StatCard icon={FaUsers} label="Promedio Jugadores/Equipo" value={`${stats.avgPlayers}`} color="purple" />
                </div>

                {/* Header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Gestión de Equipos
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Administra los equipos registrados en la plataforma
                            </p>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-xl">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <Input
                                placeholder="Buscar por nombre o categoría..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-2">
                            <ShowInactiveToggle show={showInactive} onChange={setShowInactive} />
                            <Button onClick={openCreateModal} icon={FaPlus} iconPosition="left">
                                Crear
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                    <DataTable
                        data={teams}
                        columns={columns}
                        getRowId={(t) => t.id}
                        getRowStatus={(t) => t.status}
                        onEdit={openEditModal}
                        onDelete={(t) => deleteTeam(t.id)}
                        onToggleStatus={(t) => toggleStatus(t.id, t.status)}
                        searchTerm={searchTerm}
                        searchKeys={["name", "category"]}
                    />
                </div>
            </div>

            {/* Create Modal */}
            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                form={createForm}
                onSubmit={handleCreate}
                isLoading={isActing}
            />

            {/* Edit Modal */}
            <EditTeamModal
                isOpen={editingTeam !== null}
                team={editingTeam}
                onClose={closeEditModal}
                form={updateForm}
                onSubmit={handleUpdate}
                isLoading={isActing}
            />
        </>
    );
};