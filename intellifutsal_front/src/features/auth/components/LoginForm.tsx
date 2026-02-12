import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { Button, Checkbox, Input } from "@shared/components";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { useLoginForm } from "../hooks/useLoginForm";

export const LoginForm = () => {
    const { isLoading, onSubmit } = useLoginForm();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
        mode: "onSubmit",
    });

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-gray-900">
                    Bienvenido de Vuelta
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Inicia sesión en tu cuenta para continuar
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    {...register("email")}
                    label="Correo Electrónico"
                    type="email"
                    placeholder="tu@email.com"
                    leftIcon={FiMail}
                    error={errors.email?.message}
                    autoComplete="email"
                    disabled={isLoading}
                />

                <Input
                    {...register("password")}
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    leftIcon={FiLock}
                    showPasswordToggle
                    error={errors.password?.message}
                    autoComplete="current-password"
                    disabled={isLoading}
                />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Controller
                        name="rememberMe"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                label="Recordarme"
                                color="orange"
                                disabled={isLoading}
                            />
                        )}
                    />

                    <Link
                        to="/auth/forgot-password"
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    disabled={isLoading}
                    icon={FiLogIn}
                >
                    Iniciar Sesión
                </Button>

                <div className="text-center text-sm">
                    <span className="text-gray-600">¿No tienes una cuenta?</span>{" "}
                    <Link
                        to="/auth/sign-up"
                        className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                    >
                        Crear cuenta
                    </Link>
                </div>
            </form>
        </div>
    );
};