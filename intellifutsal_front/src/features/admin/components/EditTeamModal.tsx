import { BaseModal, Input, Select, type SelectOption } from "@shared/components";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { TeamResponse } from "@features/team/types";
import { Field } from "./Field";
import { TEAM_CATEGORY_OPTIONS } from "../types";
import { ModalFooter } from "./ModalFooter";
import type { UpdateTeamSchema } from "@features/team";

interface EditTeamModalProps {
    team: TeamResponse | null;
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<UpdateTeamSchema>;
    onSubmit: (data: UpdateTeamSchema) => void | Promise<void>;
    isLoading?: boolean;
}

export const EditTeamModal = ({
    team,
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
}: EditTeamModalProps) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = form;

    if (!team) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Editar Equipo"
            subtitle="Actualiza los datos principales del equipo"
            maxWidth="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-xs text-blue-800">
                        Editando: <span className="font-semibold">{team.name}</span>{" "}
                        <span className="text-blue-700/80">(ID: {team.id})</span>
                    </p>
                </div>

                <Field
                    label="Nombre del equipo"
                    error={errors.name?.message}
                    hint="Puedes dejarlo igual si no necesitas cambiarlo"
                >
                    <Input
                        {...register("name")}
                        placeholder="Juveniles A"
                        disabled={isLoading}
                    />
                </Field>

                <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                        <Field
                            label="Categoría"
                            error={errors.category?.message}
                            hint="Puedes dejarlo igual si no necesitas cambiarlo"
                        >
                            <Select
                                options={TEAM_CATEGORY_OPTIONS as SelectOption[]}
                                placeholder="Selecciona una categoría"
                                disabled={isLoading}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                            />
                        </Field>
                    )}
                />

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs text-amber-800">
                        <span className="font-semibold">Nota:</span> Jugadores y edad promedio se recalculan automáticamente.
                    </p>
                </div>

                <ModalFooter
                    onCancel={onClose}
                    submitText="Actualizar"
                    isLoading={isLoading}
                />
            </form>
        </BaseModal>
    );
};