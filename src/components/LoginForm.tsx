import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Box, TextField, Button, Typography } from "@mui/material";

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
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler, onError)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Connexion Admin
            </Typography>
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
                id="password"
                label="Mot de passe"
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
            >
                Se connecter
            </Button>
        </Box>
    );
}; 