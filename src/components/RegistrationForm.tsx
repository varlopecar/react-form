import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { registrationSchema, type RegistrationFormData } from "../schemas/registrationSchema";

interface Props {
    onSubmit: (data: RegistrationFormData) => void;
}

export const RegistrationForm = ({ onSubmit }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
    });

    const onSubmitHandler = (data: RegistrationFormData) => {
        onSubmit(data);
        toast.success("Inscription réussie !");
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6 max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg">
            <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                    Prénom
                </label>
                <input
                    {...register("firstName")}
                    id="firstName"
                    className="mt-2 block w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                    Nom
                </label>
                <input
                    {...register("lastName")}
                    id="lastName"
                    className="mt-2 block w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
            </div>

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
                <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700">
                    Date de naissance
                </label>
                <input
                    {...register("birthDate", { valueAsDate: true })}
                    type="date"
                    id="birthDate"
                    className="mt-2 block w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.birthDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
                    Ville
                </label>
                <input
                    {...register("city")}
                    id="city"
                    className="mt-2 block w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700">
                    Code postal
                </label>
                <input
                    {...register("postalCode")}
                    id="postalCode"
                    className="mt-2 block w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition duration-300"
            >
                S'inscrire
            </button>
        </form>
    );
};