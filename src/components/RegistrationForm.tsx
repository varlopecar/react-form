import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { registrationSchema, type RegistrationFormData } from "../schemas/registrationSchema";

/**
 * Props for the RegistrationForm component
 * @interface Props
 * @property {Function} onSubmit - Callback function that receives the form data when the form is submitted
 */
interface Props {
    onSubmit: (data: RegistrationFormData) => void;
}

/**
 * A form component for user registration
 * 
 * @component
 * @param {Props} props - The component props
 * @param {Function} props.onSubmit - Callback function that receives the form data when the form is submitted
 * @returns {JSX.Element} The rendered form component
 * 
 * @example
 * ```tsx
 * <RegistrationForm onSubmit={(data) => console.log(data)} />
 * ```
 */
export const RegistrationForm = ({ onSubmit }: Props) => {
    const [isFormComplete, setIsFormComplete] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        mode: "onChange",
    });

    // Watch all form fields to check if they're filled
    const formValues = watch();

    // Check if all fields have values
    useEffect(() => {
        const allFieldsFilled =
            !!formValues.firstName?.trim() &&
            !!formValues.lastName?.trim() &&
            !!formValues.email?.trim() &&
            !!formValues.birthDate &&
            !!formValues.city?.trim() &&
            !!formValues.postalCode?.trim();

        setIsFormComplete(allFieldsFilled);
    }, [formValues]);

    /**
     * Handles the form submission
     * 
     * @param {RegistrationFormData} data - The form data
     */
    const onSubmitHandler = (data: RegistrationFormData) => {
        try {
            // Call the onSubmit callback
            onSubmit(data);

            // Save data to localStorage
            localStorage.setItem('userRegistration', JSON.stringify(data));

            // Show success toast
            toast.success("Inscription réussie !");

            // Reset the form
            reset();
        } catch (error) {
            // Show error toast if something goes wrong
            toast.error("Une erreur est survenue lors de l'inscription");
            console.error("Registration error:", error);
        }
    };

    /**
     * Handles form validation errors
     */
    const onError = () => {
        toast.error("Veuillez corriger les erreurs dans le formulaire");
    };

    return (
        <form onSubmit={handleSubmit(onSubmitHandler, onError)} role="form" className="space-y-6 max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg">
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
                disabled={!isFormComplete}
                className={`w-full py-3 px-6 rounded-lg transition duration-300 ${isFormComplete
                    ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
            >
                S'inscrire
            </button>
        </form>
    );
};