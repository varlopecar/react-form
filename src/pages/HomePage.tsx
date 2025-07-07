import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Chip,
    Alert,
    AppBar,
    Toolbar,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    InputAdornment
} from "@mui/material";
import {
    Add as AddIcon,
    AdminPanelSettings as AdminIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    People as PeopleIcon,
    Article as ArticleIcon
} from "@mui/icons-material";
import { BlogPost, User, apiService } from "../services/api";
import { toast } from "react-hot-toast";
import { RegistrationForm } from "../components/RegistrationForm";
import { type RegistrationFormData } from "../schemas/registrationSchema";

interface PostFormData {
    title: string;
    content: string;
    author: string;
}

export default function HomePage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentTab, setCurrentTab] = useState(0);
    const [formData, setFormData] = useState<PostFormData>({
        title: "",
        content: "",
        author: "",
    });

    useEffect(() => {
        loadPosts();
        loadUsers();
    }, []);

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

    const loadPosts = async () => {
        try {
            setLoading(true);
            const postsData = await apiService.getBlogPosts();
            setPosts(postsData);
        } catch (error) {
            console.error("Error loading posts:", error);
            toast.error("Error loading posts");
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const usersData = await apiService.getUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Error loading users:", error);
            toast.error("Error loading users");
        }
    };

    const handleOpenDialog = () => {
        setFormData({ title: "", content: "", author: "" });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({ title: "", content: "", author: "" });
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.content || !formData.author) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            await apiService.createBlogPost(formData);
            toast.success("Post created successfully!");
            handleCloseDialog();
            loadPosts();
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Error creating post");
        }
    };

    const handleCreateUser = async (userData: RegistrationFormData) => {
        try {
            // Add a default password for new users
            const userWithPassword = {
                ...userData,
                password: "defaultPassword123" // In a real app, you'd generate this or let admin set it
            };
            await apiService.registerUser(userWithPassword);
            toast.success("User created successfully!");
            setOpenUserDialog(false);
            loadUsers();
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error("Error creating user");
        }
    };

    const handleDeleteUser = async (userId: number) => {
        const userToDelete = users.find((u: User) => u.id === userId);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const maskEmail = (email: string) => {
        const [local, domain] = email.split('@');
        return `${local.substring(0, 2)}***@${domain}`;
    };

    const maskBirthDate = (_birthDate: string) => {
        return "**/**/****";
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Loading posts...
                </Typography>
            </Container>
        );
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Blog Platform
                    </Typography>
                    <Button 
                        color="inherit" 
                        startIcon={<AdminIcon />}
                        href="/admin"
                    >
                        Admin
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <Typography variant="h3" component="h1">
                        Welcome to Our Platform
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={currentTab === 0 ? handleOpenDialog : () => setOpenUserDialog(true)}
                    >
                        {currentTab === 0 ? "Create Post" : "Create User"}
                    </Button>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={currentTab} onChange={(_e: any, newValue: any) => setCurrentTab(newValue)}>
                        <Tab icon={<ArticleIcon />} label="Blog Posts" />
                        <Tab icon={<PeopleIcon />} label="User Management" />
                    </Tabs>
                </Box>

                {/* Blog Posts Tab */}
                {currentTab === 0 && (
                    <>
                        {posts.length === 0 ? (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No posts available. Create the first post!
                            </Alert>
                        ) : (
                            <Grid container spacing={3}>
                                {posts.map((post: BlogPost) => (
                                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={post._id}>
                                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography variant="h5" component="h2" gutterBottom>
                                                    {post.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {post.content.length > 150
                                                        ? `${post.content.substring(0, 150)}...`
                                                        : post.content}
                                                </Typography>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                                    <Chip label={post.author} size="small" color="primary" />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                )}

                {/* User Management Tab */}
                {currentTab === 1 && (
                    <>
                        {/* Search Bar */}
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search by name, email or city..."
                                value={searchTerm}
                                onChange={(e: any) => setSearchTerm(e.target.value)}
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
                                        {filteredUsers.map((user: User) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        {user.first_name} {user.last_name}
                                                        {user.is_admin && <AdminIcon color="primary" fontSize="small" />}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{maskEmail(user.email)}</TableCell>
                                                <TableCell>{user.city}</TableCell>
                                                <TableCell>{maskBirthDate(user.birth_date)}</TableCell>
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
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                    {!user.is_admin && (
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
                    </>
                )}

                {/* Create Post Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>Create a New Post</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Title"
                            fullWidth
                            variant="outlined"
                            value={formData.title}
                            onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Your Name"
                            fullWidth
                            variant="outlined"
                            value={formData.author}
                            onChange={(e: any) => setFormData({ ...formData, author: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Content"
                            fullWidth
                            multiline
                            rows={6}
                            variant="outlined"
                            value={formData.content}
                            onChange={(e: any) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            Create Post
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Create User Dialog */}
                <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Create a New User</DialogTitle>
                    <DialogContent>
                        <RegistrationForm onSubmit={handleCreateUser} />
                    </DialogContent>
                </Dialog>

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
                                            size="small"
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Created At
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