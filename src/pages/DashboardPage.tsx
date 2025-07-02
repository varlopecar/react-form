import { Box, Container } from '@mui/material';
import { UserList } from '../components/UserList';
import { User } from '../services/api';

interface DashboardPageProps {
    onLogout: () => void;
    user: User;
    token: string;
}

export default function DashboardPage({ user, token }: DashboardPageProps) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container sx={{ mt: 4 }}>
                <UserList token={token} currentUser={user} />
            </Container>
        </Box>
    );
} 