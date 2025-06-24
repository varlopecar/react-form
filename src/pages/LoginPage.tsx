import { Box, Typography, Paper, Link } from '@mui/material';
import { LoginForm } from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
    onLogin: (data: { email: string; password: string }) => Promise<void>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const navigate = useNavigate();
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
            <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>
                <LoginForm onLogin={onLogin} />
                <Box mt={2} textAlign="center">
                    <Link component="button" onClick={() => navigate('/register')}>
                        Don't have an account? Register
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
} 