import { Box, Typography, Paper, Link } from '@mui/material';
import { RegistrationForm } from '../components/RegistrationForm';
import { useNavigate } from 'react-router-dom';
import { RegistrationFormData } from '../schemas/registrationSchema';

interface RegisterPageProps {
    onSubmit: (data: RegistrationFormData) => Promise<void>;
}

export default function RegisterPage({ onSubmit }: RegisterPageProps) {
    const navigate = useNavigate();
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
            <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Register
                </Typography>
                <RegistrationForm onSubmit={onSubmit} />
                <Box mt={2} textAlign="center">
                    <Link component="button" onClick={() => navigate('/login')}>
                        Already have an account? Login
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
} 