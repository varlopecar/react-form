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
    InputAdornment
} from "@mui/material";
import {
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    AdminPanelSettings as AdminIcon
} from "@mui/icons-material";
import { User, apiService } from "../services/api";
import { toast } from "react-hot-toast";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        loadUsers();
        loadCurrentUser();
    }, []);

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

    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await apiService.getUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Error loading users:", error);
            toast.error("Erreur lors du chargement des utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    const loadCurrentUser = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (token) {
                const user = await apiService.getCurrentUser();
                setCurrentUser(user);
            }
        } catch (error) {
            console.error("Error loading current user:", error);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        const userToDelete = users.find(u => u.id === userId);
        if (!userToDelete) return;

        if (userToDelete.is_admin) {
            toast.error("Impossible de supprimer un administrateur");
            return;
        }

        if (!confirm(`Êtes-vous sûr de vouloir supprimer ${userToDelete.first_name} ${userToDelete.last_name} ?`)) {
            return;
        }

        try {
            await apiService.deleteUser(userId);
            toast.success("Utilisateur supprimé avec succès");
            loadUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Erreur lors de la suppression de l'utilisateur");
        }
    };

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR");
    };

    const maskEmail = (email: string, isAdmin: boolean) => {
        if (isAdmin) return email;
        const [local, domain] = email.split('@');
        return `${local.substring(0, 2)}***@${domain}`;
    };

    const maskBirthDate = (birthDate: string, isAdmin: boolean) => {
        if (isAdmin) return formatDate(birthDate);
        return "**/**/****";
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Chargement des utilisateurs...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Gestion des Utilisateurs
            </Typography>

            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Rechercher par nom, email ou ville..."
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
                    {searchTerm ? "Aucun utilisateur trouvé pour cette recherche." : "Aucun utilisateur disponible."}
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nom</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Ville</TableCell>
                                <TableCell>Date de naissance</TableCell>
                                <TableCell>Rôle</TableCell>
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
                                    <TableCell>{maskEmail(user.email, currentUser?.is_admin || false)}</TableCell>
                                    <TableCell>{user.city}</TableCell>
                                    <TableCell>{maskBirthDate(user.birth_date, currentUser?.is_admin || false)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.is_admin ? "Admin" : "Utilisateur"}
                                            color={user.is_admin ? "primary" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleViewUser(user)}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                        {currentUser?.is_admin && !user.is_admin && (
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteUser(user.id)}
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
                            Détails de l'utilisateur
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
                                        {maskEmail(selectedUser.email, currentUser?.is_admin || false)}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Ville
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedUser.city}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Code postal
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedUser.postal_code}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Date de naissance
                                    </Typography>
                                    <Typography variant="body1">
                                        {maskBirthDate(selectedUser.birth_date, currentUser?.is_admin || false)}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Rôle
                                    </Typography>
                                    <Chip
                                        label={selectedUser.is_admin ? "Administrateur" : "Utilisateur"}
                                        color={selectedUser.is_admin ? "primary" : "default"}
                                    />
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Date d'inscription
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(selectedUser.created_at)}
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setSelectedUser(null)}>Fermer</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
} 