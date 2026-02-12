import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox } from "@shared/components";
import { FiUserPlus } from "react-icons/fi";
import { BaseFields } from "./BaseFields";
import { CoachFields } from "./CoachFields";
import { PlayerFields } from "./PlayerFields";
import { registerSchema, type RegisterFormData } from "../schemas";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { useAuth } from "@shared/hooks";

export const RegisterForm = () => {
    const { isLoading, onSubmit } = useRegisterForm();
    const { user } = useAuth();

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            role: "PLAYER",
            acceptTerms: false,
        },
        mode: "onSubmit",
    });

    const roleOptions = useMemo(
        () => [
            { value: "COACH", label: "Entrenador / Director Técnico" },
            { value: "PLAYER", label: "Jugador" },
        ],
        []
    );

    const positionOptions = useMemo(
        () => [
            { value: "PIVOT", label: "Pivot" },
            { value: "WINGER", label: "Ala" },
            { value: "FIXO", label: "Fijo" },
            { value: "GOALKEEPER", label: "Portero" },
        ],
        []
    );

    // eslint-disable-next-line react-hooks/incompatible-library
    const selectedRole = watch("role");

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-3xl font-display font-bold text-gray-900">
                    Crear Cuenta
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Únete a IntelliFutsal y comienza tu entrenamiento con IA
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className={"grid grid-cols-1 gap-6" + (user?.onboardingStatus === "REGISTERED" ? "" : " lg:grid-cols-2" )}>
                    <div className={user?.onboardingStatus === "REGISTERED" ? "hidden" : ""}>
                        <BaseFields
                            register={register}
                            control={control}
                            errors={errors}
                            roleOptions={roleOptions}
                        />
                    </div>

                    <div>
                        {selectedRole === "COACH" && (
                            <CoachFields register={register} errors={errors} />
                        )}

                        {selectedRole === "PLAYER" && (
                            <PlayerFields
                                register={register}
                                control={control}
                                errors={errors}
                                positionOptions={positionOptions}
                            />
                        )}

                        {!selectedRole && (
                            <div className="flex items-center justify-center h-full min-h-[200px]">
                                <p className="text-sm text-gray-500 text-center">
                                    Selecciona un tipo de cuenta para continuar
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Terms & Submit */}
                <div className="space-y-4">
                    <Controller
                        name="acceptTerms"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                error={errors.acceptTerms?.message}
                                color="orange"
                                disabled={isLoading}
                                label={
                                    <span className="text-sm text-gray-700">
                                        Acepto los{" "}
                                        <Link
                                            to="/terms"
                                            className="font-semibold text-orange-600 hover:text-orange-700"
                                        >
                                            términos y condiciones
                                        </Link>{" "}
                                        y la{" "}
                                        <Link
                                            to="/privacy"
                                            className="font-semibold text-orange-600 hover:text-orange-700"
                                        >
                                            política de privacidad
                                        </Link>
                                    </span>
                                }
                            />
                        )}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={isLoading}
                        disabled={isLoading}
                        icon={FiUserPlus}
                    >
                        Crear Cuenta
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-gray-600">¿Ya tienes una cuenta?</span>{" "}
                        <Link
                            to="/auth/sign-in"
                            className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};