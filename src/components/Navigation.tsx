import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { User } from '../services/api';

interface NavigationProps {
    currentUser: User | null;
    onLogout: () => void;
    onMenuToggle?: () => void;
}

export default function Navigation({ currentUser, onLogout }: NavigationProps) {
    const [registeredName, setRegisteredName] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) {
            const reg = localStorage.getItem('userRegistration');
            if (reg) {
                try {
                    const data = JSON.parse(reg);
                    if (data.firstName && data.lastName) {
                        setRegisteredName(`${data.firstName} ${data.lastName}`);
                    }
                } catch {}
            }
        } else {
            setRegisteredName(null);
        }
    }, [currentUser]);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        React Form App
                    </RouterLink>
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {!currentUser && registeredName && (
                        <Typography variant="body2" sx={{ mr: 2 }}>
                            {registeredName}
                        </Typography>
                    )}
                    {!currentUser && (
                        <>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/"
                            >
                                Accueil
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/register"
                            >
                                S'inscrire
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/login"
                            >
                                Se connecter
                            </Button>
                        </>
                    )}

                    {currentUser && (
                        <>
                            <Typography variant="body2" sx={{ mr: 2 }}>
                                {currentUser.first_name} {currentUser.last_name} ({currentUser.email}) {currentUser.is_admin && '(Admin)'}
                            </Typography>
                            <Button color="inherit" onClick={onLogout}>
                                Logout
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
} 