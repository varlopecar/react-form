import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Box,
    Chip,
    Alert
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon
} from "@mui/icons-material";
import { BlogPost, apiService } from "../services/api";
import { toast } from "react-hot-toast";

interface PostFormData {
    title: string;
    content: string;
    author: string;
}

export default function PostsPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
    const [formData, setFormData] = useState<PostFormData>({
        title: "",
        content: "",
        author: "",
    });

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const postsData = await apiService.getBlogPosts();
            setPosts(postsData);
        } catch (error) {
            console.error("Error loading posts:", error);
            toast.error("Erreur lors du chargement des articles");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (post?: BlogPost) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                title: post.title,
                content: post.content,
                author: post.author,
            });
        } else {
            setEditingPost(null);
            setFormData({ title: "", content: "", author: "" });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingPost(null);
        setFormData({ title: "", content: "", author: "" });
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.content || !formData.author) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        try {
            if (editingPost) {
                // Update existing post
                await apiService.updateBlogPost(editingPost._id, formData);
                toast.success("Article mis à jour avec succès");
            } else {
                // Create new post
                await apiService.createBlogPost(formData);
                toast.success("Article créé avec succès");
            }
            handleCloseDialog();
            loadPosts();
        } catch (error) {
            console.error("Error saving post:", error);
            toast.error("Erreur lors de la sauvegarde de l'article");
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            return;
        }

        try {
            await apiService.deleteBlogPost(postId);
            toast.success("Article supprimé avec succès");
            loadPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Erreur lors de la suppression de l'article");
        }
    };

    const handleViewPost = (post: BlogPost) => {
        setViewingPost(post);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Chargement des articles...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h3" component="h1">
                    Gestion des Articles
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nouvel Article
                </Button>
            </Box>

            {posts.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Aucun article disponible. Créez votre premier article !
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {posts.map((post) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={post._id}>
                            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {post.content.length > 100
                                            ? `${post.content.substring(0, 100)}...`
                                            : post.content}
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Chip label={post.author} size="small" color="primary" />
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleViewPost(post)}
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="secondary"
                                        onClick={() => handleOpenDialog(post)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeletePost(post._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingPost ? "Modifier l'article" : "Créer un nouvel article"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Titre"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Auteur"
                        fullWidth
                        variant="outlined"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Contenu"
                        fullWidth
                        multiline
                        rows={6}
                        variant="outlined"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingPost ? "Mettre à jour" : "Créer"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Post Dialog */}
            <Dialog open={!!viewingPost} onClose={() => setViewingPost(null)} maxWidth="md" fullWidth>
                {viewingPost && (
                    <>
                        <DialogTitle>{viewingPost.title}</DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 2 }}>
                                <Chip label={viewingPost.author} color="primary" sx={{ mr: 1 }} />
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(viewingPost.createdAt).toLocaleDateString("fr-FR")}
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                                {viewingPost.content}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setViewingPost(null)}>Fermer</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
} 