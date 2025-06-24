import { Box, Typography, AppBar, Toolbar, Button, Container } from '@mui/material';
import { UserList } from '../components/UserList';
import { User } from '../services/api';

interface DashboardPageProps {
    onLogout: () => void;
    user: User;
    token: string;
}

export default function DashboardPage({ onLogout, user, token }: DashboardPageProps) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    {user && (
                        <Typography variant="body2" sx={{ mr: 2 }}>
                            {user.email}
                        </Typography>
                    )}
                    <Button color="inherit" onClick={onLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <UserList token={token} />
            </Container>
        </Box>
    );
} 