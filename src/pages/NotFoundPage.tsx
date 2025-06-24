import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";

/**
 * 404 Not Found page component
 * Redirects to the main page after a short delay
 * 
 * @component
 * @returns {JSX.Element} The rendered NotFoundPage component
 */
function NotFoundPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to the main page after 3 seconds
        const timer = setTimeout(() => {
            navigate("/", { replace: true });
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            textAlign="center"
            p={3}
        >
            <Typography variant="h1" component="h1" gutterBottom>
                404
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
                Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                The page you're looking for doesn't exist.
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                    Redirecting to home page...
                </Typography>
            </Box>
        </Box>
    );
}

export default NotFoundPage; 