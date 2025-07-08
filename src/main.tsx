import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import './index.css'
import App from './App'

const theme = createTheme()

// Get the basename for the router
// For GitHub Pages, we need to use the repository name as the basename
const basename = import.meta.env.BASE_URL || '/'

// Handle GitHub Pages 404 redirect
const handleGitHubPagesRedirect = () => {
  // Check if there's a stored redirect route (from 404.html)
  const redirectRoute = sessionStorage.getItem('redirectRoute');
  if (redirectRoute) {
    // Clear the stored route
    sessionStorage.removeItem('redirectRoute');
    
    // Navigate to the intended route
    window.history.replaceState(null, '', redirectRoute);
  }
};

// Call the redirect handler
handleGitHubPagesRedirect();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)

export default App;
