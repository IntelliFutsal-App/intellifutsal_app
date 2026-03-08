import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaUser, FaLock, FaDumbbell, FaSave, FaChalkboardTeacher, FaEye, FaEyeSlash } from "react-icons/fa";
import { BaseModal, Button, FieldRow, Input } from "@shared/ui";
import { useAuth, useProfile } from "@shared/hooks";
import { useUpdateProfile } from "../hooks";
import { updateCoachSchema, type CoachResponse, type UpdateCoachSchema } from "@features/coach";
import { updatePlayerSchema, type PlayerResponse, type Position, type UpdatePlayerSchema } from "@features/player";
import { updateCredentialSchema, type UpdateCredentialSchema } from "../schemas";

type TabId = "profile" | "metrics" | "credential";

const toInputDate = (date?: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
};

const POSITION_OPTIONS = [
    { value: "PIVOT", label: "Pívot" },
    { value: "WINGER", label: "Ala" },
    { value: "FIXO", label: "Poste / Fixo" },
    { value: "GOALKEEPER", label: "Portero" },
];

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { user } = useAuth();
    const { profileState } = useProfile();
    const { isSavingCredential, isSavingProfile, updateCredential, updateCoachProfile, updatePlayerProfile } =
        useUpdateProfile();

    const isCoach = user?.role === "COACH";
    const profile = profileState?.profile;
    const coach = isCoach ? (profile as CoachResponse) : null;
    const player = !isCoach ? (profile as PlayerResponse) : null;

    const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
        { id: "profile", label: isCoach ? "Datos del Entrenador" : "Datos Personales", icon: isCoach ? FaChalkboardTeacher : FaUser },
        ...(!isCoach ? [{ id: "metrics" as TabId, label: "Métricas Físicas", icon: FaDumbbell }] : []),
        { id: "credential", label: "Credencial", icon: FaLock },
    ];
    const [activeTab, setActiveTab] = useState<TabId>("profile");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const credForm = useForm<UpdateCredentialSchema>({ resolver: zodResolver(updateCredentialSchema) });

    const coachForm = useForm<UpdateCoachSchema>({
        resolver: zodResolver(updateCoachSchema),
        defaultValues: coach
            ? {
                firstName: coach.firstName,
                lastName: coach.lastName,
                birthDate: toInputDate(coach.birthDate),
                expYears: coach.expYears,
                specialty: coach.specialty,
            }
            : undefined,
    });

    const playerForm = useForm<UpdatePlayerSchema>({
        resolver: zodResolver(updatePlayerSchema),
        defaultValues: player
            ? {
                firstName: player.firstName,
                lastName: player.lastName,
                birthDate: toInputDate(player.birthDate),
                position: (player.position as Position) ?? undefined,
                height: player.height ?? undefined,
                weight: player.weight ?? undefined,
                highJump: player.highJump ?? undefined,
                rightUnipodalJump: player.rightUnipodalJump ?? undefined,
                leftUnipodalJump: player.leftUnipodalJump ?? undefined,
                bipodalJump: player.bipodalJump ?? undefined,
                thirtyMetersTime: player.thirtyMetersTime ?? undefined,
                thousandMetersTime: player.thousandMetersTime ?? undefined,
            }
            : undefined,
    });

    // Reset forms when profile changes
    useEffect(() => {
        if (coach) {
            coachForm.reset({
                firstName: coach.firstName,
                lastName: coach.lastName,
                birthDate: toInputDate(coach.birthDate),
                expYears: coach.expYears,
                specialty: coach.specialty,
            });
        }
        if (player) {
            playerForm.reset({
                firstName: player.firstName,
                lastName: player.lastName,
                birthDate: toInputDate(player.birthDate),
                position: (player.position as Position) ?? undefined,
                height: player.height ?? undefined,
                weight: player.weight ?? undefined,
                highJump: player.highJump ?? undefined,
                rightUnipodalJump: player.rightUnipodalJump ?? undefined,
                leftUnipodalJump: player.leftUnipodalJump ?? undefined,
                bipodalJump: player.bipodalJump ?? undefined,
                thirtyMetersTime: player.thirtyMetersTime ?? undefined,
                thousandMetersTime: player.thousandMetersTime ?? undefined,
            });
        }
    }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSaveCredential = credForm.handleSubmit(async (data) => {
        const payload: Record<string, string> = {};
        if (data.email) payload.email = data.email;
        if (data.password) payload.password = data.password;
        if (Object.keys(payload).length === 0) return;
        await updateCredential(payload);
        credForm.reset();
    });

    const handleSaveCoach = coachForm.handleSubmit(async (data) => {
        await updateCoachProfile({ ...data, birthDate: new Date(data.birthDate) });
    });

    const handleSavePlayer = playerForm.handleSubmit(async (data) => {
        await updatePlayerProfile({ ...data, birthDate: new Date(data.birthDate) });
    });

    const handleSaveMetrics = playerForm.handleSubmit(async (data) => {
        await updatePlayerProfile({ ...data, birthDate: new Date(data.birthDate) });
    });

    const isSaving = isSavingCredential || isSavingProfile;

    const pe = playerForm.formState.errors;
    const ce = coachForm.formState.errors;
    const cre = credForm.formState.errors;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar Perfil"
            icon={FaUser}
            iconColor="orange"
            maxWidth="2xl"
        >
            <div className="flex items-center gap-4 mb-6 p-4 bg-linear-to-r from-gray-50 to-orange-50/30 rounded-xl border border-gray-100">
                <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(`${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`)}&background=ea580c&color=fff&size=80`}
                    alt="Avatar"
                    className="w-14 h-14 rounded-full ring-2 ring-orange-200 shrink-0"
                />
                <div className="min-w-0">
                    <p className="font-bold text-gray-800 truncate">
                        {profile?.firstName} {profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{isCoach ? "Entrenador" : "Jugador"}</p>
                    {user?.email && (
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${activeTab === tab.id
                                    ? "bg-white text-orange-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <Icon className="shrink-0" />
                            <span className="hidden sm:block truncate">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {activeTab === "profile" && isCoach && (
                <form onSubmit={handleSaveCoach} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldRow label="Nombre" error={ce.firstName?.message}>
                            <Input {...coachForm.register("firstName")} placeholder="Nombre" />
                        </FieldRow>
                        <FieldRow label="Apellido" error={ce.lastName?.message}>
                            <Input {...coachForm.register("lastName")} placeholder="Apellido" />
                        </FieldRow>
                    </div>
                    <FieldRow label="Fecha de Nacimiento" error={ce.birthDate?.message}>
                        <Input type="date" {...coachForm.register("birthDate")} />
                    </FieldRow>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldRow label="Años de Experiencia" error={ce.expYears?.message}>
                            <Input type="number" min={0} max={60} {...coachForm.register("expYears")} />
                        </FieldRow>
                        <FieldRow label="Especialidad" error={ce.specialty?.message}>
                            <Input {...coachForm.register("specialty")} placeholder="Ej. Fútbol sala" />
                        </FieldRow>
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button type="submit" variant="primary" icon={FaSave} iconPosition="left" disabled={isSaving} size="sm">
                            {isSavingProfile ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            )}

            {activeTab === "profile" && !isCoach && (
                <form onSubmit={handleSavePlayer} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldRow label="Nombre" error={pe.firstName?.message}>
                            <Input {...playerForm.register("firstName")} placeholder="Nombre" />
                        </FieldRow>
                        <FieldRow label="Apellido" error={pe.lastName?.message}>
                            <Input {...playerForm.register("lastName")} placeholder="Apellido" />
                        </FieldRow>
                    </div>
                    <FieldRow label="Fecha de Nacimiento" error={pe.birthDate?.message}>
                        <Input type="date" {...playerForm.register("birthDate")} />
                    </FieldRow>
                    <FieldRow label="Posición" error={pe.position?.message}>
                        <select
                            {...playerForm.register("position")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        >
                            <option value="">Seleccionar posición</option>
                            {POSITION_OPTIONS.map((p) => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                    </FieldRow>
                    <div className="grid grid-cols-2 gap-4">
                        <FieldRow label="Altura (cm)" error={pe.height?.message}>
                            <Input type="number" step="0.1" {...playerForm.register("height", { valueAsNumber: true })} />
                        </FieldRow>
                        <FieldRow label="Peso (kg)" error={pe.weight?.message}>
                            <Input type="number" step="0.1" {...playerForm.register("weight", { valueAsNumber: true })} />
                        </FieldRow>
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button type="submit" variant="primary" icon={FaSave} iconPosition="left" disabled={isSaving} size="sm">
                            {isSavingProfile ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            )}

            {activeTab === "metrics" && !isCoach && (
                <form onSubmit={handleSaveMetrics} className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-2">
                        <p className="text-xs text-blue-800">
                            <span className="font-bold">Importante:</span> Actualizar tus métricas físicas mejora
                            la precisión de los análisis de IA y las recomendaciones de entrenamiento.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FieldRow label="Salto Alto (cm)" error={pe.highJump?.message}>
                            <Input type="number" step="0.1" min="0" {...playerForm.register("highJump", { valueAsNumber: true })} />
                        </FieldRow>
                        <FieldRow label="Salto Bipodal (cm)" error={pe.bipodalJump?.message}>
                            <Input type="number" step="0.1" min="0" {...playerForm.register("bipodalJump", { valueAsNumber: true })} />
                        </FieldRow>
                        <FieldRow label="Salto Unipodal Der. (cm)" error={pe.rightUnipodalJump?.message}>
                            <Input type="number" step="0.1" min="0" {...playerForm.register("rightUnipodalJump", { valueAsNumber: true })} />
                        </FieldRow>
                        <FieldRow label="Salto Unipodal Izq. (cm)" error={pe.leftUnipodalJump?.message}>
                            <Input type="number" step="0.1" min="0" {...playerForm.register("leftUnipodalJump", { valueAsNumber: true })} />
                        </FieldRow>
                        <FieldRow label="Tiempo 30m (s)" error={pe.thirtyMetersTime?.message}>
                            <Input type="number" step="0.01" min="0" {...playerForm.register("thirtyMetersTime", { valueAsNumber: true })} />
                        </FieldRow>
                        <FieldRow label="Tiempo 1000m (s)" error={pe.thousandMetersTime?.message}>
                            <Input type="number" step="0.1" min="0" {...playerForm.register("thousandMetersTime", { valueAsNumber: true })} />
                        </FieldRow>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" variant="primary" icon={FaSave} iconPosition="left" disabled={isSaving} size="sm">
                            {isSavingProfile ? "Guardando..." : "Guardar Métricas"}
                        </Button>
                    </div>
                </form>
            )}

            {activeTab === "credential" && (
                <form onSubmit={handleSaveCredential} className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-2">
                        <p className="text-xs text-amber-800">
                            <span className="font-bold">Atención:</span> Deja en blanco los campos que no quieras
                            modificar. Al cambiar la contraseña se cerrará la sesión en otros dispositivos.
                        </p>
                    </div>

                    <FieldRow label="Nuevo Email" error={cre.email?.message}>
                        <Input
                            type="email"
                            placeholder={user?.email ?? "Correo actual"}
                            {...credForm.register("email")}
                        />
                    </FieldRow>

                    <FieldRow label="Nueva Contraseña" error={cre.password?.message}>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mínimo 8 caracteres"
                                {...credForm.register("password")}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </FieldRow>

                    <FieldRow label="Confirmar Contraseña" error={cre.confirmPassword?.message}>
                        <div className="relative">
                            <Input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Repetir contraseña"
                                {...credForm.register("confirmPassword")}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </FieldRow>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" variant="primary" icon={FaSave} iconPosition="left" disabled={isSaving} size="sm">
                            {isSavingCredential ? "Guardando..." : "Actualizar Credencial"}
                        </Button>
                    </div>
                </form>
            )}
        </BaseModal>
    );
};