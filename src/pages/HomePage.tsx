import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Box,
    AppBar,
    Toolbar,
    Tabs,
    Tab,
    Button,
    Alert
} from "@mui/material";
import {
    Article as ArticleIcon,
    People as PeopleIcon,
    AdminPanelSettings as AdminIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PostsSection from "../components/PostsSection";
import UsersSection from "../components/UsersSection";
import { toast } from "react-hot-toast";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

export default function HomePage() {
    const [currentTab, setCurrentTab] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in and is admin
        const token = localStorage.getItem("authToken");
        if (token) {
            // In a real app, you'd decode the JWT token to check admin status
            // For now, we'll check if there's a token and assume admin for demo
            setIsAdmin(true);
        }
    }, []);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleAdminLogin = () => {
        navigate("/admin/login");
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAdmin(false);
        toast.success("Logged out successfully");
    };

    return (
        <>
            {/* Header */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Blog & User Management System
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {!isAdmin ? (
                            <Button 
                                color="inherit" 
                                startIcon={<AdminIcon />}
                                onClick={handleAdminLogin}
                            >
                                Admin Login
                            </Button>
                        ) : (
                            <Button 
                                color="inherit" 
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {/* Welcome Message */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome to Our Blog Platform
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {isAdmin 
                            ? "You are logged in as an administrator. You can manage posts and users."
                            : "Browse our blog posts and register new users. Admin login required for management features."
                        }
                    </Typography>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs 
                        value={currentTab} 
                        onChange={handleTabChange} 
                        aria-label="main navigation tabs"
                    >
                        <Tab 
                            label="Blog Posts" 
                            icon={<ArticleIcon />} 
                            iconPosition="start"
                        />
                        <Tab 
                            label={isAdmin ? "User Management" : "User Registration"} 
                            icon={<PeopleIcon />} 
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                {/* Tab Panels */}
                <TabPanel value={currentTab} index={0}>
                    <PostsSection isAdmin={isAdmin} />
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                    <UsersSection isAdmin={isAdmin} />
                </TabPanel>

                {/* Info for non-admin users */}
                {!isAdmin && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                        <Typography variant="body2">
                            <strong>Admin Features:</strong> Login as administrator to delete posts and view detailed user information.
                        </Typography>
                    </Alert>
                )}
            </Container>
        </>
    );
} 