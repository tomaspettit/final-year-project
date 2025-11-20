import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CircularProgress, Box, Fade } from "@mui/material";
import Landing from './Pages/Landing'
import Home from './Pages/Home'
import Settings from './Pages/Settings'
import Profile from './Pages/Profile'
import Play from './Pages/Play'
import Tutorial from './Pages/Tutorial'
import Friends from './Pages/Friends'
import BottomNav from './Components/BottomNav';
import { useAuthState } from "react-firebase-hooks/auth";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { auth } from './firebase';
import './App.css'

const theme = createTheme({
  // Dark Theme Settings
  colorSchemes: {
    dark: {
      palette: {
        mode: 'dark',
        primary: {
          main: '#ffffff',
        },
        secondary: {
          main: '#03dac6',
        },
        background: {
          default: '#121212',
          paper: '#ffffff'
        },
        text: {
          primary: "#000000",
          secondary: "#bbbbbb",
        },
        error: {
          main: "#cf6679",
        },
        warning: {
          main: "#ffa000",
        },
        info: {
          main: "#0288d1",
        },
        success: {
          main: "#388e3c",
        },
      },
    },
  },
  // Light Theme Settings
  palette: {
    mode: 'light',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#aa00ff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    text: {
      primary: "#ffffffff",
      secondary: "#000000ff",
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#f57c00",
    },
    info: {
      main: "#1976d2",
    },
    success: {
      main: "#2e7d32",
    },
  },  
    typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#000000',
        },
      },
    },
  },
});

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <Fade in={loading} timeout={{ enter: 500, exit: 500 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </Fade>
    );
  } // Display loading spinner with fade effect while checking auth

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures global dark mode */}
      <BrowserRouter>
        <div>
          <Routes>
            {/* Show Landing Page (Login & Signup) only if the user is NOT logged in */}
            <Route path="/" element={user ? <Home /> : <Landing />} />

            {/* Protected Routes - Accessible only when logged in */}
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
            <Route path="/play" element={user ? <Play /> : <Navigate to="/" />} />
            <Route path="/tutorial" element={user ? <Tutorial /> : <Navigate to="/" />} />
            <Route path="/friends" element={user ? <Friends /> : <Navigate to="/" />} />
          </Routes>

          {/* Bottom Navigation Bar for easy access */}
          {user && <BottomNav />}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
