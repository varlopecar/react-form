import { useState, useEffect } from "react";
import { Typography, Container, Card, CardContent, CardActions, Button, Chip, Grid } from "@mui/material";
import { BlogPost, apiService } from "../services/api";
import { toast } from "react-hot-toast";

export default function HomePage() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlogPosts();
    }, []);

    const loadBlogPosts = async () => {
        try {
            setLoading(true);
            const posts = await apiService.getBlogPosts();
            setBlogPosts(posts);
        } catch (error) {
            console.error("Error loading blog posts:", error);
            toast.error("Erreur lors du chargement des articles de blog");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            return;
        }

        try {
            await apiService.deleteBlogPost(postId);
            toast.success("Article supprimé avec succès");
            loadBlogPosts();
        } catch (error) {
            console.error("Error deleting blog post:", error);
            toast.error("Erreur lors de la suppression de l'article");
        }
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
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                Blog - Articles Récents
            </Typography>

            {blogPosts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 0" }}>
                    <Typography variant="h6" color="text.secondary">
                        Aucun article disponible pour le moment.
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        Les articles de blog seront affichés ici une fois qu'ils seront créés.
                    </Typography>
                </div>
            ) : (
                <Grid container spacing={3}>
                    {blogPosts.map((post) => (
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
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                        <Chip label={post.author} size="small" color="primary" />
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                                        </Typography>
                                    </div>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary">
                                        Lire plus
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeletePost(post._id)}
                                    >
                                        Supprimer
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
} 