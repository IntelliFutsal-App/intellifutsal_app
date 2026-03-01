import { useMemo, useState } from "react";
import { FaLayerGroup, FaLink, FaPlus, FaSearch } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, DataTable, Input, InlineLoading } from "@shared/components";
import { StatCard } from "./StatCard";
import { formatStringDate } from "@shared/utils";
import { useClustersManagement } from "../hooks";
import { usePlayerClustersManagement } from "../hooks";
import { createClusterSchema, updateClusterSchema, createPlayerClusterSchema, updatePlayerClusterSchema, toClusterOptions, toPlayerOptions, type ClusterResponse, type CreateClusterSchema, type UpdateClusterSchema, type PlayerClusterResponse, type CreatePlayerClusterSchema, type UpdatePlayerClusterSchema } from "@features/ai-module";
import { CreateClusterModal, EditClusterModal, CreatePlayerClusterModal, EditPlayerClusterModal } from "@features/admin";

type ViewMode = "clusters" | "assignments";
type Option = { value: string; label: string };

export const ClustersManagementSection = () => {
    // CRUD Clusters
    const {
        clusters,
        stats: clusterStats,
        isLoading: isLoadingClusters,
        isActing: isActingClusters,
        createCluster,
        updateCluster,
        deleteCluster,
    } = useClustersManagement();

    // CRUD Relations + data for selects
    const {
        items,
        clusters: clustersFromRelations,
        playersActive,
        stats: relStats,
        isLoading: isLoadingRelations,
        isActing: isActingRelations,
        createItem,
        updateItem,
        deleteItem,
    } = usePlayerClustersManagement();

    // prefer a single clusters source if available
    const clustersFinal = clusters.length > 0 ? clusters : clustersFromRelations;

    const [view, setView] = useState<ViewMode>("clusters");
    const [searchTerm, setSearchTerm] = useState("");

    const isLoading = view === "clusters" ? isLoadingClusters : isLoadingRelations;
    const isActing = isActingClusters || isActingRelations;

    // ------- maps & options -------
    const playerOptions: Option[] = useMemo(() => toPlayerOptions(playersActive), [playersActive]);
    const clusterOptions: Option[] = useMemo(() => toClusterOptions(clustersFinal), [clustersFinal]);

    const clusterDescById = useMemo(() => {
        const m = new Map<number, string>();
        clustersFinal.forEach((c) => m.set(c.id, c.description));
        return m;
    }, [clustersFinal]);

    const playerNameById = useMemo(() => {
        const m = new Map<number, string>();
        playersActive.forEach((p) => m.set(p.id, `${p.firstName} ${p.lastName}`.trim()));
        return m;
    }, [playersActive]);

    const relationsByClusterId = useMemo(() => {
        const m = new Map<number, PlayerClusterResponse[]>();
        items.forEach((it) => {
            const arr = m.get(it.clusterId) ?? [];
            arr.push(it);
            m.set(it.clusterId, arr);
        });
        return m;
    }, [items]);

    // ------- Cluster modals state -------
    const [isCreateClusterOpen, setIsCreateClusterOpen] = useState(false);
    const [editingCluster, setEditingCluster] = useState<ClusterResponse | null>(null);

    const createClusterForm = useForm<CreateClusterSchema>({
        resolver: zodResolver(createClusterSchema),
        mode: "onSubmit",
        defaultValues: { description: "" },
    });

    const updateClusterForm = useForm<UpdateClusterSchema>({
        resolver: zodResolver(updateClusterSchema),
        mode: "onSubmit",
        defaultValues: { id: 0, description: "" },
    });

    const openCreateCluster = () => {
        createClusterForm.reset({ description: "" });
        setIsCreateClusterOpen(true);
    };

    const closeCreateCluster = () => {
        setIsCreateClusterOpen(false);
        createClusterForm.reset({ description: "" });
    };

    const openEditCluster = (c: ClusterResponse) => {
        updateClusterForm.reset({ id: c.id, description: c.description });
        setEditingCluster(c);
    };

    const closeEditCluster = () => {
        setEditingCluster(null);
        updateClusterForm.reset({ id: 0, description: "" });
    };

    const handleCreateCluster = async (
        data: CreateClusterSchema,
        extras?: { playerId?: number }
    ) => {
        const created = await createCluster({ description: data.description });

        const playerId = extras?.playerId;
        if (playerId && created?.id) {
            await createItem({ playerId, clusterId: created.id });
        }

        closeCreateCluster();
    };

    const handleUpdateCluster = async (
        data: UpdateClusterSchema,
        extras?: {
            action?: "none" | "create" | "update";
            playerId?: number;
            relationId?: number;
        }
    ) => {
        if (!editingCluster) return;

        await updateCluster({ id: editingCluster.id, description: data.description });

        if (extras?.action === "create" && extras.playerId) {
            await createItem({ playerId: extras.playerId, clusterId: editingCluster.id });
        }

        if (extras?.action === "update" && extras.relationId && extras.playerId) {
            await updateItem({ id: extras.relationId, playerId: extras.playerId, clusterId: editingCluster.id });
        }

        closeEditCluster();
    };

    // ------- Relation modals state -------
    const [isCreateRelOpen, setIsCreateRelOpen] = useState(false);
    const [editingRel, setEditingRel] = useState<PlayerClusterResponse | null>(null);

    const createRelForm = useForm<CreatePlayerClusterSchema>({
        resolver: zodResolver(createPlayerClusterSchema),
        mode: "onSubmit",
        defaultValues: { playerId: 0, clusterId: 0 },
    });

    const updateRelForm = useForm<UpdatePlayerClusterSchema>({
        resolver: zodResolver(updatePlayerClusterSchema),
        mode: "onSubmit",
        defaultValues: { id: 0, playerId: 0, clusterId: 0 },
    });

    const openCreateRel = () => {
        createRelForm.reset({ playerId: 0, clusterId: 0 });
        setIsCreateRelOpen(true);
    };

    const closeCreateRel = () => {
        setIsCreateRelOpen(false);
        createRelForm.reset({ playerId: 0, clusterId: 0 });
    };

    const openEditRel = (row: PlayerClusterResponse) => {
        updateRelForm.reset({ id: row.id, playerId: row.playerId, clusterId: row.clusterId });
        setEditingRel(row);
    };

    const closeEditRel = () => {
        setEditingRel(null);
        updateRelForm.reset({ id: 0, playerId: 0, clusterId: 0 });
    };

    const handleCreateRel = async (data: CreatePlayerClusterSchema) => {
        await createItem({ playerId: data.playerId, clusterId: data.clusterId });
        closeCreateRel();
    };

    const handleUpdateRel = async (data: UpdatePlayerClusterSchema) => {
        if (!editingRel) return;
        await updateItem({
            id: editingRel.id,
            playerId: data.playerId,
            clusterId: data.clusterId,
        });
        closeEditRel();
    };

    // ------- tables -------
    const clusterColumns = useMemo(
        () => [
            { header: "ID", accessor: "id" as const, width: "80px" },
            { header: "Descripción", accessor: "description" as const },
            {
                header: "Creación",
                accessor: (r: ClusterResponse) => formatStringDate(r.creationDate as unknown as string),
            },
        ],
        []
    );

    const relColumns = useMemo(
        () => [
            { header: "ID", accessor: "id" as const, width: "80px" },
            {
                header: "Jugador",
                accessor: (r: PlayerClusterResponse) =>
                    playerNameById.get(r.playerId) ?? `Jugador #${r.playerId}`,
            },
            {
                header: "Cluster",
                accessor: (r: PlayerClusterResponse) => {
                    const desc = clusterDescById.get(r.clusterId);
                    return desc ? `#${r.clusterId} — ${desc}` : `Cluster #${r.clusterId}`;
                },
            },
            {
                header: "Creado",
                accessor: (r: PlayerClusterResponse) => formatStringDate(r.createdAt as unknown as string),
            },
        ],
        [clusterDescById, playerNameById]
    );

    const headerTitle = view === "clusters" ? "Gestión de Clusters" : "Gestión de Asignaciones";
    const headerSubtitle =
        view === "clusters"
            ? "Administra los clusters del sistema y asigna jugadores desde el detalle"
            : "Administra relaciones entre jugadores y clusters";

    const primaryAction = () => {
        if (view === "clusters") return openCreateCluster;
        return openCreateRel;
    };

    const primaryActionText = view === "clusters" ? "Crear Cluster" : "Crear Asignación";

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <InlineLoading
                    title={view === "clusters" ? "Cargando clusters..." : "Cargando asignaciones..."}
                    description="Preparando la información"
                />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Stats */}
                {view === "clusters" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatCard icon={FaLayerGroup} label="Total" value={clusterStats.total.toString()} color="orange" />
                        <StatCard
                            icon={FaLink}
                            label="Asignaciones"
                            value={relStats.total.toString()}
                            color="blue"
                        />
                        <StatCard
                            icon={FaLink}
                            label="Jugadores activos"
                            value={playersActive.length.toString()}
                            color="green"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatCard icon={FaLink} label="Total asignaciones" value={relStats.total.toString()} color="blue" />
                        <StatCard icon={FaLayerGroup} label="Clusters" value={clustersFinal.length.toString()} color="orange" />
                        <StatCard icon={FaLink} label="Jugadores activos" value={playersActive.length.toString()} color="green" />
                    </div>
                )}

                {/* Header + view switch */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                {headerTitle}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">{headerSubtitle}</p>

                            <div className="mt-4 inline-flex rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setView("clusters")}
                                    className={`px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${view === "clusters"
                                            ? "bg-linear-to-r from-orange-500 to-orange-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Clusters
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView("assignments")}
                                    className={`px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${view === "assignments"
                                            ? "bg-linear-to-r from-orange-500 to-orange-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Asignaciones
                                </button>
                            </div>
                        </div>

                        <Button onClick={primaryAction()} icon={FaPlus} iconPosition="left" disabled={isActing}>
                            {primaryActionText}
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-xl">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <Input
                                placeholder={
                                    view === "clusters"
                                        ? "Buscar por descripción..."
                                        : "Buscar por playerId o clusterId..."
                                }
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                    {view === "clusters" ? (
                        <DataTable
                            data={clustersFinal}
                            columns={clusterColumns}
                            getRowId={(c) => c.id}
                            getRowLabel={(c) => `#${c.id}`}
                            onEdit={openEditCluster}
                            onDelete={(c) => void deleteCluster(c.id)}
                            searchTerm={searchTerm}
                            searchKeys={["description"]}
                            isDeleting={isActing}
                        />
                    ) : (
                        <DataTable
                            data={items}
                            columns={relColumns}
                            getRowId={(r) => r.id}
                            getRowLabel={(r) => `#${r.id} (P:${r.playerId} → C:${r.clusterId})`}
                            onEdit={openEditRel}
                            onDelete={(r) => void deleteItem(r.id)}
                            searchTerm={searchTerm}
                            searchKeys={["playerId", "clusterId"]}
                            isDeleting={isActing}
                        />
                    )}
                </div>
            </div>

            <CreateClusterModal
                isOpen={isCreateClusterOpen}
                onClose={closeCreateCluster}
                form={createClusterForm}
                onSubmit={handleCreateCluster}
                isLoading={isActing}
                playerOptions={playerOptions}
            />

            <EditClusterModal
                isOpen={editingCluster !== null}
                cluster={editingCluster}
                onClose={closeEditCluster}
                form={updateClusterForm}
                onSubmit={handleUpdateCluster}
                isLoading={isActing}
                playerOptions={playerOptions}
                relationsForCluster={
                    editingCluster ? relationsByClusterId.get(editingCluster.id) ?? [] : []
                }
                playerNameById={playerNameById}
            />

            {/* Relation modals (full CRUD) */}
            <CreatePlayerClusterModal
                isOpen={isCreateRelOpen}
                onClose={closeCreateRel}
                form={createRelForm}
                onSubmit={handleCreateRel}
                isLoading={isActing}
                playerOptions={playerOptions}
                clusterOptions={clusterOptions}
            />

            <EditPlayerClusterModal
                isOpen={editingRel !== null}
                item={editingRel}
                onClose={closeEditRel}
                form={updateRelForm}
                onSubmit={handleUpdateRel}
                isLoading={isActing}
                playerOptions={playerOptions}
                clusterOptions={clusterOptions}
            />
        </>
    );
};