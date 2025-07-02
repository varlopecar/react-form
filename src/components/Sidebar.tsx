import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Home as HomeIcon,
    Article as ArticleIcon,
    People as PeopleIcon,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { User } from '../services/api';

interface SidebarProps {
    currentUser: User | null;
    onLogout: () => void;
    open: boolean;
    onToggle: () => void;
}

const drawerWidth = 240;

export default function Sidebar({ currentUser, onLogout, open, onToggle }: SidebarProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    const menuItems = [
        { text: 'Accueil', icon: <HomeIcon />, path: '/' },
        { text: 'Articles', icon: <ArticleIcon />, path: '/posts' },
        { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/users' },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    ];

    const drawerContent = (
        <Box sx={{ width: drawerWidth }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" noWrap component="div">
                    React Form App
                </Typography>
                {currentUser && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {currentUser.email}
                        {currentUser.is_admin && ' (Admin)'}
                    </Typography>
                )}
            </Box>

            {/* Navigation Menu */}
            <List sx={{ pt: 1 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />

            {/* Logout */}
            {currentUser && (
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={onLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Déconnexion" />
                        </ListItemButton>
                    </ListItem>
                </List>
            )}
        </Box>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            {isMobile && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
            )}

            {/* Desktop Drawer */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={open}
                    onClose={onToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}
        </>
    );
} 