import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { User, apiService } from "../services/api";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
    Tooltip
} from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";

interface Props {
    token: string;
    currentUser: User;
}

export const UserList = ({ token, currentUser }: Props) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showUserDetails, setShowUserDetails] = useState(false);

    useEffect(() => {
        loadUsers();
    }, [token]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await apiService.getUsers();
            setUsers(usersData);
        } catch (error) {
            toast.error("Erreur lors du chargement des utilisateurs");
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            return;
        }

        try {
            await apiService.deleteUser(userId);
            toast.success("Utilisateur supprimé avec succès");
            loadUsers(); // Reload the list
        } catch (error) {
            toast.error("Erreur lors de la suppression de l'utilisateur");
            console.error("Error deleting user:", error);
        }
    };

    const handleViewUserDetails = (user: User) => {
        setSelectedUser(user);
        setShowUserDetails(true);
    };

    const handleCloseUserDetails = () => {
        setSelectedUser(null);
        setShowUserDetails(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-lg">Chargement des utilisateurs...</div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-6xl mx-auto p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Liste des Utilisateurs ({users.length})
                </h2>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nom
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    {currentUser.is_admin && (
                                        <>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ville
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Code Postal
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date de naissance
                                            </th>
                                        </>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Admin
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.first_name} {user.last_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        {currentUser.is_admin && (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.city}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.postal_code}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(user.birth_date).toLocaleDateString('fr-FR')}
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.is_admin
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.is_admin ? 'Oui' : 'Non'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {currentUser.is_admin && (
                                                    <Tooltip title="Voir les détails">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewUserDetails(user)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {currentUser.is_admin && !user.is_admin && (
                                                    <Tooltip title="Supprimer l'utilisateur">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* User Details Dialog */}
            <Dialog
                open={showUserDetails}
                onClose={handleCloseUserDetails}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Détails de l'utilisateur
                </DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                {selectedUser.first_name} {selectedUser.last_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Email:</strong> {selectedUser.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Ville:</strong> {selectedUser.city}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Code Postal:</strong> {selectedUser.postal_code}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Date de naissance:</strong> {new Date(selectedUser.birth_date).toLocaleDateString('fr-FR')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Statut Admin:</strong> {selectedUser.is_admin ? 'Oui' : 'Non'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Date de création:</strong> {new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Date de création:</strong> {new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUserDetails} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}; 