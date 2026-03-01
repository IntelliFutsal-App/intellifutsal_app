import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRunning, FaPlus, FaSearch } from "react-icons/fa";
import { Button, DataTable, Input, ShowInactiveToggle, StatusBadge } from "@shared/components";
import { StatCard, type ColorType } from "./StatCard";
import { createPlayerSchema, updatePlayerSchema, type CreatePlayerSchema, type PlayerResponse, type Position, type UpdatePlayerSchema } from "@features/player";
import { formatStringDate } from "@shared/utils";
import { CreatePlayerModal, EditPlayerModal, POSITION_OPTIONS, type PositionValue } from "@features/admin";
import { usePlayersManagement } from "../hooks";

export const PlayersManagementSection = () => {
    const { players, stats, showInactive, setShowInactive, createPlayer, updatePlayer, toggleStatus, deletePlayer } =
        usePlayersManagement();

    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<PlayerResponse | null>(null);
    const [isActing, setIsActing] = useState(false);

    const createForm = useForm<CreatePlayerSchema>({
        resolver: zodResolver(createPlayerSchema),
        mode: "onSubmit",
        defaultValues: {
            firstName: "",
            lastName: "",
            birthDate: "",
            position: "" as unknown as PositionValue,
            height: undefined,
            weight: undefined,
            highJump: undefined,
            bipodalJump: undefined,
            rightUnipodalJump: undefined,
            leftUnipodalJump: undefined,
            thirtyMetersTime: undefined,
            thousandMetersTime: undefined,
        },
    });

    const updateForm = useForm<UpdatePlayerSchema>({
        resolver: zodResolver(updatePlayerSchema),
        mode: "onSubmit",
        defaultValues: {
            id: undefined,
            firstName: undefined,
            lastName: undefined,
            birthDate: undefined,
            position: undefined,
            height: undefined,
            weight: undefined,
            highJump: undefined,
            bipodalJump: undefined,
            rightUnipodalJump: undefined,
            leftUnipodalJump: undefined,
            thirtyMetersTime: undefined,
            thousandMetersTime: undefined,
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

    const openEditModal = (player: PlayerResponse) => {
        const birthDateStr =
            player.birthDate
                ? new Date(player.birthDate).toISOString().slice(0, 10)
                : undefined;

        updateForm.reset({
            id: player.id,
            firstName: player.firstName ?? undefined,
            lastName: player.lastName ?? undefined,
            position: player.position as Position ?? undefined,
            birthDate: birthDateStr,
            height: player.height ?? undefined,
            weight: player.weight ?? undefined,
            highJump: player.highJump ?? undefined,
            bipodalJump: player.bipodalJump ?? undefined,
            rightUnipodalJump: player.rightUnipodalJump ?? undefined,
            leftUnipodalJump: player.leftUnipodalJump ?? undefined,
            thirtyMetersTime: player.thirtyMetersTime ?? undefined,
            thousandMetersTime: player.thousandMetersTime ?? undefined,
        });

        setEditingPlayer(player);
    };

    const closeEditModal = () => {
        setEditingPlayer(null);
        updateForm.reset();
    };

    const handleCreate = async (data: CreatePlayerSchema) => {
        try {
            setIsActing(true);
            await createPlayer({ ...data, birthDate: new Date(data.birthDate) });
            closeCreateModal();
        } finally {
            setIsActing(false);
        }
    };

    const handleUpdate = async (data: UpdatePlayerSchema) => {
        try {
            setIsActing(true);
            await updatePlayer({
                ...data,
                birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
            });
            closeEditModal();
        } finally {
            setIsActing(false);
        }
    };

    const columns = useMemo(
        () => [
            { header: "ID", accessor: "id" as const, width: "80px" },
            { header: "Nombre", accessor: (r: PlayerResponse) => `${r.firstName} ${r.lastName}` },
            { header: "Edad", accessor: "age" as const },
            {
                header: "Posición",
                accessor: (r: PlayerResponse) =>
                    POSITION_OPTIONS.find((p) => p.value === (r.position))?.label || (r.position),
            },
            { header: "Altura", accessor: (r: PlayerResponse) => `${(r).height} cm` },
            { header: "Peso", accessor: (r: PlayerResponse) => `${(r).weight} kg` },
            { header: "IMC", accessor: (r: PlayerResponse) => Number((r).bmi).toFixed(1) },
            { header: "Estado", accessor: (r: PlayerResponse) => <StatusBadge status={(r).status} /> },
            { header: "Creado", accessor: (r: PlayerResponse) => formatStringDate((r).createdAt) },
        ],
        []
    );

    const statCards = useMemo(
        () => [
            { icon: FaRunning, label: "Total", value: stats.total.toString(), color: "orange" as ColorType },
            { icon: FaRunning, label: "Activos", value: stats.active.toString(), color: "blue" as ColorType },
            { icon: FaRunning, label: "Edad Promedio", value: `${stats.avgAge} años`, color: "green" as ColorType },
        ],
        [stats]
    );

    return (
        <>
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {statCards.map((s, i) => (
                        <StatCard key={i} {...s} />
                    ))}
                </div>

                {/* Header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Gestión de Jugadores
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Administra los jugadores registrados en la plataforma
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
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-2">
                            <ShowInactiveToggle show={showInactive} onChange={setShowInactive} />
                            <Button onClick={openCreateModal} icon={FaPlus} iconPosition="left" disabled={isActing}>
                                Crear
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                    <DataTable
                        data={players}
                        columns={columns}
                        getRowId={(p) => p.id}
                        getRowStatus={(p) => p.status}
                        onEdit={openEditModal}
                        onDelete={(p) => deletePlayer(p.id)}
                        onToggleStatus={(p) => toggleStatus(p.id, p.status)}
                        searchTerm={searchTerm}
                        searchKeys={["firstName", "lastName", "position"]}
                    />
                </div>
            </div>

            {/* Create Modal (extraído) */}
            <CreatePlayerModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                form={createForm}
                onSubmit={handleCreate}
                isLoading={isActing}
            />

            {/* Edit Modal (extraído) */}
            <EditPlayerModal
                isOpen={editingPlayer !== null}
                player={editingPlayer}
                onClose={closeEditModal}
                form={updateForm}
                onSubmit={handleUpdate}
                isLoading={isActing}
            />
        </>
    );
};