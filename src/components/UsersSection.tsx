import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { User, apiService } from '../services/api';
import { RegistrationForm } from './RegistrationForm';
import { RegistrationFormData } from '../schemas/registrationSchema';
import { toast } from 'react-hot-toast';

interface UsersSectionProps {
  isAdmin?: boolean;
}

export default function UsersSection({ isAdmin = false }: UsersSectionProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter((user: User) =>
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
      console.error('Error loading users:', error);
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: RegistrationFormData) => {
    try {
      // Add a default password for new users
      const userWithPassword = {
        ...userData,
        password: 'defaultPassword123' // In a real app, you'd generate this or let admin set it
      };
      await apiService.registerUser(userWithPassword);
      toast.success('User created successfully!');
      setOpenUserDialog(false);
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const userToDelete = users.find((u: User) => u.id === userId);
    if (!userToDelete) return;

    if (userToDelete.is_admin) {
      toast.error('Cannot delete an administrator');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${userToDelete.first_name} ${userToDelete.last_name}?`)) {
      return;
    }

    try {
      await apiService.deleteUser(userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    return `${local.substring(0, 2)}***@${domain}`;
  };

  const maskBirthDate = (_birthDate: string) => {
    return '**/**/****';
  };

  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            User Registration
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenUserDialog(true)}
            sx={{ ml: 2 }}
          >
            Create User
          </Button>
        </Box>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Public User Registration:</strong> Anyone can register new users. Admin login required to view and manage existing users.
          </Typography>
        </Alert>

        {/* Create User Dialog */}
        <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New User</DialogTitle>
          <DialogContent>
            <RegistrationForm onSubmit={handleCreateUser} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading users...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenUserDialog(true)}
          sx={{ ml: 2 }}
        >
          Create User
        </Button>
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users by name, email, or city..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {filteredUsers.length === 0 ? (
        <Alert severity="info">
          No users found matching your search criteria.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {user.first_name} {user.last_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {maskBirthDate(user.birth_date)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{maskEmail(user.email)}</TableCell>
                  <TableCell>{user.city}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_admin ? 'Admin' : 'User'}
                      color={user.is_admin ? 'error' : 'default'}
                      size="small"
                      icon={user.is_admin ? <AdminIcon /> : undefined}
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewUser(user)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      {!user.is_admin && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteUser(user.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create User Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <RegistrationForm onSubmit={handleCreateUser} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedUser.first_name} {selectedUser.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Email:</strong> {selectedUser.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Birth Date:</strong> {selectedUser.birth_date}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>City:</strong> {selectedUser.city}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Postal Code:</strong> {selectedUser.postal_code}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Role:</strong> {selectedUser.is_admin ? 'Administrator' : 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Created:</strong> {formatDate(selectedUser.created_at)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Created:</strong> {formatDate(selectedUser.created_at)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 