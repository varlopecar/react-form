import { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Alert,
    AppBar,
    Toolbar
} from "@mui/material";
import {
    Home as HomeIcon
} from "@mui/icons-material";
import { apiService } from "../services/api";
import { toast } from "react-hot-toast";

export default function AdminLoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.login(formData);
            localStorage.setItem("authToken", response.access_token);
            toast.success("Login successful!");
            // Redirect to admin panel
            window.location.href = "/admin";
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Admin Login
                    </Typography>
                    <Button 
                        color="inherit" 
                        startIcon={<HomeIcon />}
                        href="/"
                    >
                        Home
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Admin Login
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                        Please log in to access the admin panel
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </Box>

                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>Demo Credentials:</strong><br />
                            Email: admin@example.com<br />
                            Password: password123
                        </Typography>
                    </Alert>
                </Paper>
            </Container>
        </>
    );
} 