import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { registrationSchema, type RegistrationFormData } from "../schemas/registrationSchema";
import { Box, TextField, Button, Typography } from "@mui/material";

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
            toast.success("Registration successful!");

            // Reset the form
            reset();
        } catch (error) {
            // Show error toast if something goes wrong
            toast.error("An error occurred during registration");
            console.error("Registration error:", error);
        }
    };

    /**
     * Handles form validation errors
     */
    const onError = () => {
        toast.error("Please correct the errors in the form");
    };

    return (
        <Box component="form" role="form" onSubmit={handleSubmit(onSubmitHandler, onError)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Registration Form
            </Typography>
            <TextField
                id="firstName"
                label="First Name"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                fullWidth
            />
            <TextField
                id="lastName"
                label="Last Name"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                fullWidth
            />
            <TextField
                id="email"
                label="Email"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
            />
            <TextField
                id="birthDate"
                label="Birth Date"
                type="date"
                {...register("birthDate", { valueAsDate: true })}
                error={!!errors.birthDate}
                helperText={errors.birthDate?.message}
                fullWidth
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                id="city"
                label="City"
                {...register("city")}
                error={!!errors.city}
                helperText={errors.city?.message}
                fullWidth
            />
            <TextField
                id="postalCode"
                label="Postal Code"
                {...register("postalCode")}
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
                fullWidth
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isFormComplete}
                fullWidth
                sx={{ mt: 2 }}
            >
                Register
            </Button>
        </Box>
    );
};