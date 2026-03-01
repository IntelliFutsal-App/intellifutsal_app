import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaLink, FaPlus, FaSearch, FaUsers } from "react-icons/fa";
import { Button, DataTable, Input, InlineLoading, ShowInactiveToggle, StatusBadge, Badge } from "@shared/components";
import { StatCard } from "./StatCard";
import { formatStringDate } from "@shared/utils";
import { coachTeamService, createCoachTeamSchema, createPlayerTeamSchema, playerTeamService, teamService, toCoachOptions, toDateInputValue, toPlayerOptions, toTeamOptions, updateCoachTeamSchema, updatePlayerTeamSchema, type CoachTeamResponse, type CreateCoachTeamSchema, type CreatePlayerTeamSchema, type Option, type PlayerTeamResponse, type TeamResponse, type UpdateCoachTeamSchema, type UpdatePlayerTeamSchema } from "@features/team";
import { coachService, type CoachResponse } from "@features/coach";
import { playerService, type PlayerResponse } from "@features/player";
import { CreateCoachTeamModal, CreatePlayerTeamModal, EditCoachTeamModal, EditPlayerTeamModal } from "@features/admin";

type View = "coachTeams" | "playerTeams";

export const TeamLinksManagementSection = () => {
    const [view, setView] = useState<View>("coachTeams");
    const [searchTerm, setSearchTerm] = useState("");

    const [showInactive, setShowInactive] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isActing, setIsActing] = useState(false);

    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [coaches, setCoaches] = useState<CoachResponse[]>([]);
    const [players, setPlayers] = useState<PlayerResponse[]>([]);

    const [coachTeams, setCoachTeams] = useState<CoachTeamResponse[]>([]);
    const [playerTeams, setPlayerTeams] = useState<PlayerTeamResponse[]>([]);

    // modals state
    const [isCreateCoachTeamOpen, setIsCreateCoachTeamOpen] = useState(false);
    const [editingCoachTeam, setEditingCoachTeam] = useState<CoachTeamResponse | null>(null);

    const [isCreatePlayerTeamOpen, setIsCreatePlayerTeamOpen] = useState(false);
    const [editingPlayerTeam, setEditingPlayerTeam] = useState<PlayerTeamResponse | null>(null);

    // options & maps
    const teamOptions: Option[] = useMemo(() => toTeamOptions(teams), [teams]);
    const coachOptions: Option[] = useMemo(() => toCoachOptions(coaches), [coaches]);
    const playerOptions: Option[] = useMemo(() => toPlayerOptions(players), [players]);

    const teamNameById = useMemo(() => {
        const m = new Map<number, string>();
        teams.forEach((t) => m.set(t.id, t.name ?? `Equipo #${t.id}`));
        return m;
    }, [teams]);

    const coachNameById = useMemo(() => {
        const m = new Map<number, string>();
        coaches.forEach((c) => m.set(c.id, `${c.firstName} ${c.lastName}`.trim()));
        return m;
    }, [coaches]);

    const playerNameById = useMemo(() => {
        const m = new Map<number, string>();
        players.forEach((p) => m.set(p.id, `${p.firstName} ${p.lastName}`.trim()));
        return m;
    }, [players]);

    const loadAll = async () => {
        setIsLoading(true);
        try {
            // base lists
            const [teamsRes, coachesRes, playersRes] = await Promise.all([
                teamService.findAll(),
                coachService.findAll(),
                playerService.findAll(),
            ]);

            setTeams(teamsRes);
            setCoaches(coachesRes);
            setPlayers(playersRes);

            // links
            const [ctRes, ptRes] = await Promise.all([
                showInactive ? coachTeamService.findAllIncludingInactive() : coachTeamService.findAll(),
                showInactive ? playerTeamService.findAllIncludingInactive() : playerTeamService.findAll(),
            ]);

            setCoachTeams(ctRes);
            setPlayerTeams(ptRes);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showInactive]);

    // ------- forms -------
    const createCoachTeamForm = useForm<CreateCoachTeamSchema>({
        resolver: zodResolver(createCoachTeamSchema),
        mode: "onSubmit",
        defaultValues: { coachId: 0, teamId: 0, assignmentDate: "", endDate: "" },
    });

    const updateCoachTeamForm = useForm<UpdateCoachTeamSchema>({
        resolver: zodResolver(updateCoachTeamSchema),
        mode: "onSubmit",
        defaultValues: { id: 0, coachId: undefined, teamId: undefined, assignmentDate: "", endDate: "" },
    });

    const createPlayerTeamForm = useForm<CreatePlayerTeamSchema>({
        resolver: zodResolver(createPlayerTeamSchema),
        mode: "onSubmit",
        defaultValues: { playerId: 0, teamId: 0, entryDate: "", exitDate: "" },
    });

    const updatePlayerTeamForm = useForm<UpdatePlayerTeamSchema>({
        resolver: zodResolver(updatePlayerTeamSchema),
        mode: "onSubmit",
        defaultValues: { id: 0, playerId: undefined, teamId: undefined, entryDate: "", exitDate: "" },
    });

    // ------- open/close helpers -------
    const openCreate = () => {
        if (view === "coachTeams") {
            createCoachTeamForm.reset({ coachId: 0, teamId: 0, assignmentDate: "", endDate: "" });
            setIsCreateCoachTeamOpen(true);
            return;
        }

        createPlayerTeamForm.reset({ playerId: 0, teamId: 0, entryDate: "", exitDate: "" });
        setIsCreatePlayerTeamOpen(true);
    };

    const closeCreateCoachTeam = () => {
        setIsCreateCoachTeamOpen(false);
        createCoachTeamForm.reset({ coachId: 0, teamId: 0, assignmentDate: "", endDate: "" });
    };

    const closeCreatePlayerTeam = () => {
        setIsCreatePlayerTeamOpen(false);
        createPlayerTeamForm.reset({ playerId: 0, teamId: 0, entryDate: "", exitDate: "" });
    };

    const openEditCoachTeam = (row: CoachTeamResponse) => {
        updateCoachTeamForm.reset({
            id: row.id,
            coachId: row.coachId,
            teamId: row.teamId,
            assignmentDate: toDateInputValue(row.assignmentDate),
            endDate: toDateInputValue(row.endDate),
        });
        setEditingCoachTeam(row);
    };

    const closeEditCoachTeam = () => {
        setEditingCoachTeam(null);
        updateCoachTeamForm.reset({ id: 0, coachId: undefined, teamId: undefined, assignmentDate: "", endDate: "" });
    };

    const openEditPlayerTeam = (row: PlayerTeamResponse) => {
        updatePlayerTeamForm.reset({
            id: row.id,
            playerId: row.playerId,
            teamId: row.teamId,
            entryDate: toDateInputValue(row.entryDate),
            exitDate: toDateInputValue(row.exitDate),
        });
        setEditingPlayerTeam(row);
    };

    const closeEditPlayerTeam = () => {
        setEditingPlayerTeam(null);
        updatePlayerTeamForm.reset({ id: 0, playerId: undefined, teamId: undefined, entryDate: "", exitDate: "" });
    };

    // ------- actions -------
    const handleCreateCoachTeam = async (data: CreateCoachTeamSchema) => {
        try {
            setIsActing(true);

            const payload: { coachId: number } & { teamId: number; assignmentDate: string; endDate?: string } = {
                coachId: data.coachId,
                teamId: data.teamId,
                assignmentDate: data.assignmentDate,
                ...(data.endDate ? { endDate: data.endDate } : {}),
            };

            await coachTeamService.create(payload);

            await loadAll();
            closeCreateCoachTeam();
        } finally {
            setIsActing(false);
        }
    };

    const handleUpdateCoachTeam = async (data: UpdateCoachTeamSchema) => {
        if (!editingCoachTeam) return;

        try {
            setIsActing(true);

            await coachTeamService.update({
                id: editingCoachTeam.id,
                ...(data.coachId ? { coachId: data.coachId } : {}),
                ...(data.teamId ? { teamId: data.teamId } : {}),
                ...(data.assignmentDate ? { assignmentDate: new Date(data.assignmentDate) } : {}),
                ...(data.endDate ? { endDate: new Date(data.endDate) } : {}),
            });

            await loadAll();
            closeEditCoachTeam();
        } finally {
            setIsActing(false);
        }
    };

    const handleCreatePlayerTeam = async (data: CreatePlayerTeamSchema) => {
        try {
            setIsActing(true);

            await playerTeamService.create({
                playerId: data.playerId,
                teamId: data.teamId,
                entryDate: new Date(data.entryDate),
                ...(data.exitDate ? { exitDate: new Date(data.exitDate) } : {}),
            });

            await loadAll();
            closeCreatePlayerTeam();
        } finally {
            setIsActing(false);
        }
    };

    const handleUpdatePlayerTeam = async (data: UpdatePlayerTeamSchema) => {
        if (!editingPlayerTeam) return;

        try {
            setIsActing(true);

            await playerTeamService.update({
                id: editingPlayerTeam.id,
                ...(data.playerId ? { playerId: data.playerId } : {}),
                ...(data.teamId ? { teamId: data.teamId } : {}),
                ...(data.entryDate ? { entryDate: new Date(data.entryDate) } : {}),
                ...(data.exitDate ? { exitDate: new Date(data.exitDate) } : {}),
            });

            await loadAll();
            closeEditPlayerTeam();
        } finally {
            setIsActing(false);
        }
    };

    const handleDeleteCoachTeam = async (row: CoachTeamResponse) => {
        try {
            setIsActing(true);
            await coachTeamService.delete(row.id);
            await loadAll();
        } finally {
            setIsActing(false);
        }
    };

    const handleDeletePlayerTeam = async (row: PlayerTeamResponse) => {
        try {
            setIsActing(true);
            await playerTeamService.delete(row.id);
            await loadAll();
        } finally {
            setIsActing(false);
        }
    };

    const toggleCoachTeamStatus = async (row: CoachTeamResponse) => {
        try {
            setIsActing(true);
            await coachTeamService.updateStatus(row.id, { status: !row.status });
            await loadAll();
        } finally {
            setIsActing(false);
        }
    };

    const togglePlayerTeamStatus = async (row: PlayerTeamResponse) => {
        try {
            setIsActing(true);
            await playerTeamService.updateStatus(row.id, { status: !row.status });
            await loadAll();
        } finally {
            setIsActing(false);
        }
    };

    // ------- columns -------
    const coachTeamColumns = useMemo(
        () => [
            { header: "ID", accessor: "id" as const, width: "80px" },
            {
                header: "Entrenador",
                accessor: (r: CoachTeamResponse) => coachNameById.get(r.coachId) ?? `Coach #${r.coachId}`,
            },
            {
                header: "Equipo",
                accessor: (r: CoachTeamResponse) => teamNameById.get(r.teamId) ?? `Team #${r.teamId}`,
            },
            {
                header: "Asignación",
                accessor: (r: CoachTeamResponse) => formatStringDate(r.assignmentDate as unknown as string),
            },
            {
                header: "Fin",
                accessor: (r: CoachTeamResponse) => (r.endDate ? formatStringDate(r.endDate as unknown as string) : "—"),
            },
            { header: "Estado", accessor: (r: CoachTeamResponse) => <StatusBadge status={r.status} /> },
        ],
        [coachNameById, teamNameById]
    );

    const playerTeamColumns = useMemo(
        () => [
            { header: "ID", accessor: "id" as const, width: "80px" },
            {
                header: "Jugador",
                accessor: (r: PlayerTeamResponse) => playerNameById.get(r.playerId) ?? `Player #${r.playerId}`,
            },
            {
                header: "Equipo",
                accessor: (r: PlayerTeamResponse) => teamNameById.get(r.teamId) ?? `Team #${r.teamId}`,
            },
            {
                header: "Ingreso",
                accessor: (r: PlayerTeamResponse) => formatStringDate(r.entryDate as unknown as string),
            },
            {
                header: "Salida",
                accessor: (r: PlayerTeamResponse) => (r.exitDate ? formatStringDate(r.exitDate as unknown as string) : "—"),
            },
            { header: "Estado", accessor: (r: PlayerTeamResponse) => <StatusBadge status={r.status} /> },
        ],
        [playerNameById, teamNameById]
    );

    const stats = useMemo(() => {
        const ctTotal = coachTeams.length;
        const ctActive = coachTeams.filter((x) => x.status).length;

        const ptTotal = playerTeams.length;
        const ptActive = playerTeams.filter((x) => x.status).length;

        return {
            ctTotal,
            ctActive,
            ptTotal,
            ptActive,
        };
    }, [coachTeams, playerTeams]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <InlineLoading title="Cargando relaciones..." description="Preparando la información" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={FaLink} label="Entrenadores / Equipos" value={String(stats.ctTotal)} color="orange" />
                    <StatCard icon={FaLink} label="Entrenadores / Equipos Activos" value={String(stats.ctActive)} color="blue" />
                    <StatCard icon={FaUsers} label="Jugadores / Equipos" value={String(stats.ptTotal)} color="green" />
                    <StatCard icon={FaUsers} label="Jugadores / Equipos Activos" value={String(stats.ptActive)} color="purple" />
                </div>

                {/* Header + tabs */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Gestión de Equipos y Asignaciones
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Administra las relaciones entre equipos y entrenadores/jugadores
                            </p>

                            <div className="mt-4 inline-flex rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setView("coachTeams")}
                                    className={`px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${view === "coachTeams" ? "bg-linear-to-r from-orange-500 to-orange-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Entrenadores / Equipos
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView("playerTeams")}
                                    className={`px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${view === "playerTeams" ? "bg-linear-to-r from-orange-500 to-orange-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Jugadores / Equipos
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <ShowInactiveToggle show={showInactive} onChange={setShowInactive} />
                            <Button onClick={openCreate} icon={FaPlus} iconPosition="left" disabled={isActing}>
                                {view === "coachTeams" ? "Crear Asignación" : "Crear Asignación"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-xl">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <Input
                                placeholder={view === "coachTeams" ? "Buscar por coachId o teamId..." : "Buscar por playerId o teamId..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Badge variant="primary" className="w-fit">
                            {view === "coachTeams" ? `${coachTeams.length} registros` : `${playerTeams.length} registros`}
                        </Badge>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                    {view === "coachTeams" ? (
                        <DataTable
                            data={coachTeams}
                            columns={coachTeamColumns}
                            getRowId={(r) => r.id}
                            getRowLabel={(r) => `#${r.id} (Coach:${r.coachId} → Team:${r.teamId})`}
                            getRowStatus={(r) => r.status}
                            onToggleStatus={toggleCoachTeamStatus}
                            onEdit={openEditCoachTeam}
                            onDelete={handleDeleteCoachTeam}
                            searchTerm={searchTerm}
                            searchKeys={["coachId", "teamId"]}
                            isDeleting={isActing}
                        />
                    ) : (
                        <DataTable
                            data={playerTeams}
                            columns={playerTeamColumns}
                            getRowId={(r) => r.id}
                            getRowLabel={(r) => `#${r.id} (Player:${r.playerId} → Team:${r.teamId})`}
                            getRowStatus={(r) => r.status}
                            onToggleStatus={togglePlayerTeamStatus}
                            onEdit={openEditPlayerTeam}
                            onDelete={handleDeletePlayerTeam}
                            searchTerm={searchTerm}
                            searchKeys={["playerId", "teamId"]}
                            isDeleting={isActing}
                        />
                    )}
                </div>
            </div>

            {/* CoachTeam Modals */}
            <CreateCoachTeamModal
                isOpen={isCreateCoachTeamOpen}
                onClose={closeCreateCoachTeam}
                form={createCoachTeamForm}
                onSubmit={handleCreateCoachTeam}
                isLoading={isActing}
                teamOptions={teamOptions}
                coachOptions={coachOptions}
            />

            <EditCoachTeamModal
                isOpen={editingCoachTeam !== null}
                onClose={closeEditCoachTeam}
                form={updateCoachTeamForm}
                onSubmit={handleUpdateCoachTeam}
                isLoading={isActing}
                item={editingCoachTeam}
                teamOptions={teamOptions}
                coachOptions={coachOptions}
                coachLabel={editingCoachTeam ? coachNameById.get(editingCoachTeam.coachId) : undefined}
                teamLabel={editingCoachTeam ? teamNameById.get(editingCoachTeam.teamId) : undefined}
            />

            {/* PlayerTeam Modals */}
            <CreatePlayerTeamModal
                isOpen={isCreatePlayerTeamOpen}
                onClose={closeCreatePlayerTeam}
                form={createPlayerTeamForm}
                onSubmit={handleCreatePlayerTeam}
                isLoading={isActing}
                teamOptions={teamOptions}
                playerOptions={playerOptions}
            />

            <EditPlayerTeamModal
                isOpen={editingPlayerTeam !== null}
                onClose={closeEditPlayerTeam}
                form={updatePlayerTeamForm}
                onSubmit={handleUpdatePlayerTeam}
                isLoading={isActing}
                item={editingPlayerTeam}
                teamOptions={teamOptions}
                playerOptions={playerOptions}
                playerLabel={editingPlayerTeam ? playerNameById.get(editingPlayerTeam.playerId) : undefined}
                teamLabel={editingPlayerTeam ? teamNameById.get(editingPlayerTeam.teamId) : undefined}
            />
        </>
    );
};