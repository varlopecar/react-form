import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("L'email n'est pas valide"),
    password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface Props {
    onLogin: (data: LoginFormData) => void;
}

export const LoginForm = ({ onLogin }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmitHandler = (data: LoginFormData) => {
        try {
            onLogin(data);
            reset();
        } catch (error) {
            toast.error("Une erreur est survenue lors de la connexion");
            console.error("Login error:", error);
        }
    };

    const onError = () => {
        toast.error("Veuillez corriger les erreurs dans le formulaire");
    };

    return (
        <form onSubmit={handleSubmit(onSubmitHandler, onError)} className="space-y-6 max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Connexion Admin
            </h2>

            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email
                </label>
                <input
                    {...register("email")}
                    type="email"
                    id="email"
                    className="mt-2 block w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Mot de passe
                </label>
                <input
                    {...register("password")}
                    type="password"
                    id="password"
                    className="mt-2 block w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition duration-300"
            >
                Se connecter
            </button>
        </form>
    );
}; 