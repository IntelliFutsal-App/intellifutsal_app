import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPlus, FaSearch, FaUsers } from "react-icons/fa";
import { Button, DataTable, Input, ShowInactiveToggle, StatusBadge, Badge } from "@shared/components";
import { StatCard, type ColorType } from "./StatCard";
import { createCredentialSchema, updateCredentialSchema, type CreateCredentialSchema, type UpdateCredentialSchema, type UserResponse } from "@features/profile";
import { formatStringDate } from "@shared/utils";
import { useUsersManagement } from "../hooks";
import { CreateUserModal, EditUserModal, ROLE_OPTIONS, type RoleOptionValue } from "@features/admin";

export const UsersManagementSection = () => {
    const {
        users,
        stats,
        showInactive,
        setShowInactive,
        createUser,
        updateUser,
        toggleStatus,
        deleteUser,
        approveCoach,
    } = useUsersManagement();

    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
    const [isActing, setIsActing] = useState(false);

    const createForm = useForm<CreateCredentialSchema>({
        resolver: zodResolver(createCredentialSchema),
        defaultValues: { email: "", password: "", role: "" as RoleOptionValue },
        mode: "onSubmit",
    });

    const updateForm = useForm<UpdateCredentialSchema>({
        resolver: zodResolver(updateCredentialSchema),
        defaultValues: { id: undefined, email: "", password: "" },
        mode: "onSubmit",
    });

    const openCreateModal = () => {
        createForm.reset({ email: "", password: "", role: "" as RoleOptionValue });
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        createForm.reset({ email: "", password: "", role: "" as RoleOptionValue });
    };

    const openEditModal = (user: UserResponse) => {
        updateForm.reset({ id: user.id, email: user.email, password: "" });
        setEditingUser(user);
    };

    const closeEditModal = () => {
        setEditingUser(null);
        updateForm.reset({ id: undefined, email: "", password: "" });
    };

    const handleCreate = async (data: CreateCredentialSchema) => {
        try {
            setIsActing(true);
            await createUser(data);
            closeCreateModal();
        } finally {
            setIsActing(false);
        }
    };

    const handleUpdate = async (data: UpdateCredentialSchema) => {
        if (!editingUser?.id) return;

        try {
            setIsActing(true);
            await updateUser({ ...data, id: editingUser.id });
            closeEditModal();
        } finally {
            setIsActing(false);
        }
    };

    const columns = useMemo(
        () => [
            { header: "ID", accessor: "id" as const, width: "80px" },
            { header: "Email", accessor: "email" as const },
            {
                header: "Rol",
                accessor: (row: UserResponse) =>
                    ROLE_OPTIONS.find((r) => r.value === row.role)?.label || row.role,
            },
            {
                header: "Onboarding",
                accessor: (row: UserResponse) => (
                    <Badge
                        variant={row.onboardingStatus === "PENDING" ? "warning" : "success"}
                        className="w-fit"
                    >
                        {row.onboardingStatus === "PENDING" ? "Pendiente" : "Completado"}
                    </Badge>
                ),
            },
            { header: "Estado", accessor: (row: UserResponse) => <StatusBadge status={row.status} /> },
            { header: "Creado", accessor: (row: UserResponse) => formatStringDate(row.createdAt) },
        ],
        []
    );

    const statCards = useMemo(
        () => [
            { icon: FaUsers, label: "Total Usuarios", value: stats.total.toString(), color: "orange" as ColorType },
            {
                icon: FaUsers,
                label: "Usuarios Activos",
                value: stats.active.toString(),
                trend: `${stats.byRole.ADMIN || 0} admins`,
                color: "blue" as ColorType,
            },
            { icon: FaUsers, label: "Entrenadores", value: String(stats.byRole.COACH || 0), color: "green" as ColorType },
            { icon: FaUsers, label: "Jugadores", value: String(stats.byRole.PLAYER || 0), color: "purple" as ColorType },
        ],
        [stats]
    );

    return (
        <>
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((s, i) => (
                        <StatCard key={i} {...s} />
                    ))}
                </div>

                {/* Header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Gestión de Usuarios
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Administra credenciales y permisos del sistema
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pending coaches alert */}
                {stats.pendingCoaches.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
                        <p className="text-sm font-semibold text-amber-900 mb-3">
                            {stats.pendingCoaches.length} entrenador
                            {stats.pendingCoaches.length > 1 ? "es" : ""} pendiente
                            {stats.pendingCoaches.length > 1 ? "s" : ""} de aprobación
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {stats.pendingCoaches.map((user) => (
                                <Button
                                    key={user.id}
                                    size="xs"
                                    variant="outline"
                                    disabled={isActing}
                                    onClick={async () => {
                                        try {
                                            setIsActing(true);
                                            await approveCoach(user.id, true);
                                        } finally {
                                            setIsActing(false);
                                        }
                                    }}
                                    className="border-amber-300 text-amber-900 bg-white hover:bg-amber-100"
                                >
                                    Aprobar: {user.email}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Toolbar */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-xl">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <Input
                                placeholder="Buscar por email..."
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
                                Crear Usuario
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                    <DataTable
                        data={users}
                        columns={columns}
                        getRowId={(u) => u.id}
                        getRowStatus={(u) => u.status}
                        onEdit={openEditModal}
                        onDelete={(u) => deleteUser(u.id)}
                        onToggleStatus={(u) => toggleStatus(u.id, u.status)}
                        searchTerm={searchTerm}
                        searchKeys={["email"]}
                    />
                </div>
            </div>

            {/* Create Modal (extraído) */}
            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                form={createForm}
                onSubmit={handleCreate}
                isLoading={isActing}
            />

            {/* Edit Modal (extraído) */}
            <EditUserModal
                isOpen={editingUser !== null}
                user={editingUser}
                onClose={closeEditModal}
                form={updateForm}
                onSubmit={handleUpdate}
                isLoading={isActing}
            />
        </>
    );
};