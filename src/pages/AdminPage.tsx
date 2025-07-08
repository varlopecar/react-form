import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Box,
    Alert,
    TextField,
    InputAdornment,
    AppBar,
    Toolbar
} from "@mui/material";
import {
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    AdminPanelSettings as AdminIcon,
    Logout as LogoutIcon,
    Home as HomeIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { User, apiService } from "../services/api";
import { toast } from "react-hot-toast";

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            loadUsers();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Filter users based on search term
        const filtered = users.filter(user =>
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [users, searchTerm]);

    const checkAuth = () => {
        const token = localStorage.getItem("authToken");
        if (token) {
            // For demo purposes, we'll assume the user is authenticated
            // In a real app, you'd verify the token with the backend
            setIsAuthenticated(true);
            // Mock current user for demo
            setCurrentUser({
                id: 1,
                email: "admin@example.com",
                first_name: "Admin",
                last_name: "User",
                birth_date: "1990-01-01",
                city: "Paris",
                postal_code: "75001",
                is_admin: true,
                created_at: "2024-01-01T00:00:00Z",
                // updated_at field removed as it doesn't exist in database schema
            });
        } else {
            // Redirect to login using React Router
            navigate("/admin/login");
        }
    };

    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await apiService.getUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Error loading users:", error);
            toast.error("Error loading users");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        const userToDelete = users.find(u => u.id === userId);
        if (!userToDelete) return;

        if (userToDelete.is_admin) {
            toast.error("Cannot delete an administrator");
            return;
        }

        if (!confirm(`Are you sure you want to delete ${userToDelete.first_name} ${userToDelete.last_name}?`)) {
            return;
        }

        try {
            await apiService.deleteUser(userId);
            toast.success("User deleted successfully");
            loadUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Error deleting user");
        }
    };

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setCurrentUser(null);
        navigate("/");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (!isAuthenticated) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Unauthorized Access
                </Typography>
                <Typography variant="body1" align="center">
                    Please log in to access the admin panel.
                </Typography>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Loading users...
                </Typography>
            </Container>
        );
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Admin Panel
                    </Typography>
                    <Button 
                        color="inherit" 
                        startIcon={<HomeIcon />}
                        href="/"
                        sx={{ mr: 2 }}
                    >
                        Home
                    </Button>
                    <Button 
                        color="inherit" 
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Admin Panel
                </Typography>

                {/* Search Bar */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by name, email or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {filteredUsers.length === 0 ? (
                    <Alert severity="info">
                        {searchTerm ? "No users found for this search." : "No users available."}
                    </Alert>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>City</TableCell>
                                    <TableCell>Birth Date</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                {user.first_name} {user.last_name}
                                                {user.is_admin && <AdminIcon color="primary" fontSize="small" />}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.city}</TableCell>
                                        <TableCell>{formatDate(user.birth_date)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.is_admin ? "Admin" : "User"}
                                                color={user.is_admin ? "primary" : "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleViewUser(user)}
                                                data-testid="view-button"
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                            {currentUser?.is_admin && !user.is_admin && (
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    data-testid="delete-button"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* User Details Dialog */}
                <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="sm" fullWidth>
                    {selectedUser && (
                        <>
                            <DialogTitle>
                                User Details
                                {selectedUser.is_admin && <AdminIcon color="primary" sx={{ ml: 1 }} />}
                            </DialogTitle>
                            <DialogContent>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedUser.first_name} {selectedUser.last_name}
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedUser.email}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            City
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedUser.city}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Postal Code
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedUser.postal_code}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Birth Date
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(selectedUser.birth_date)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Role
                                        </Typography>
                                        <Chip
                                            label={selectedUser.is_admin ? "Administrator" : "User"}
                                            color={selectedUser.is_admin ? "primary" : "default"}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Registration Date
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(selectedUser.created_at)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setSelectedUser(null)}>Close</Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>
            </Container>
        </>
    );
} 