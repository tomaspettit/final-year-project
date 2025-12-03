import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CachedIcon from "@mui/icons-material/Cached";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import WarningIcon from "@mui/icons-material/Warning";
import InstallPWA from "../Components/InstallPWA";
import PaletteIcon from '@mui/icons-material/Palette';
import GridOnIcon from '@mui/icons-material/GridOn';
import TextureIcon from '@mui/icons-material/Texture';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import LensIcon from '@mui/icons-material/Lens';
import { Sun, Moon } from "lucide-react";

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  
  // Appearance settings with state
  const [boardTheme, setBoardTheme] = useState(
    localStorage.getItem('boardTheme') || 'classic'
  );
  const [pieceSet, setPieceSet] = useState(
    localStorage.getItem('pieceSet') || 'standard'
  );

  // Function to clear cache (only Cache API, not auth storage)
  const clearCache = async () => {
    setIsClearing(true);
    try {
      // Clear caches using Cache API
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      setSnackbarMessage("Cache cleared successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      
      return true;
    } catch (error) {
      console.error("Error clearing cache:", error);
      setSnackbarMessage("Failed to clear cache");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      
      return false;
    } finally {
      setIsClearing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
      setSnackbarMessage("Logout failed");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClearCacheConfirmed = async () => {
    setConfirmDialogOpen(false);
    const success = await clearCache();
    if (success) {
      // Only logout and redirect if cache was cleared successfully
      await logout();
      navigate("/", { replace: true });
    }
  };

  // Handle appearance changes
  const handleBoardThemeChange = (theme: string) => {
    setBoardTheme(theme);
    localStorage.setItem('boardTheme', theme);
    // TODO: Apply theme to board component
  };

  const handlePieceSetChange = (set: string) => {
    setPieceSet(set);
    localStorage.setItem('pieceSet', set);
    // TODO: Apply piece set to board component
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", p: 2 }}>
      <Card sx={{ 
        width: "100%",
        maxWidth: "450px", 
        padding: 3, 
        textAlign: "center", 
        boxShadow: 3,
        borderRadius: 3,
      }}>
        <CardContent>
          {/* Back Button */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton onClick={() => navigate("/profile")} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" color="primary" fontWeight="bold">Settings</Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            Manage your account settings.
          </Typography>

          <Button onClick={toggleTheme} sx={{ mt: 2, ml: 2 }}>
                  {isDark ? <Sun /> : <Moon />}
          </Button>

          {/* Cache Management Section */}
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            borderRadius: 2,
            bgcolor: 'action.hover',
            border: 1,
            borderColor: 'divider',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Cache Management
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
              If you're experiencing issues with outdated content, clearing the cache may help.
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={isClearing ? <CircularProgress size={20} /> : <CachedIcon />}
              onClick={() => setConfirmDialogOpen(true)} 
              disabled={isClearing}
              fullWidth
              sx={{ borderRadius: 2, mb: 2 }}
            >
              Clear Cache & Reload
            </Button>
          </Box>

          {/* PWA Install Section */}
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            borderRadius: 2,
            bgcolor: 'action.hover',
            border: 1,
            borderColor: 'divider',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Install App
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
              Install GOTCG on your device for a better experience and offline access.
            </Typography>
            <InstallPWA />
          </Box>

          {/* Appearance Section */}
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            borderRadius: 2,
            bgcolor: 'action.hover',
            border: 1,
            borderColor: 'divider',
            mb: 3,
            textAlign: 'left'
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              🎨 Appearance
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
              Customize the look and feel of the application.
            </Typography>
            <Button onClick={toggleTheme} sx={{ mt: 2, ml: 2 }}>
                  {isDark ? <Sun /> : <Moon />}
            </Button>

            {/* Board Theme */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel sx={{ mb: 1, fontSize: '0.875rem', color: 'text.primary' }}>
                Board Theme
              </FormLabel>
              <Select 
                value={boardTheme}
                onChange={(e) => handleBoardThemeChange(e.target.value)}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="classic">
                  <PaletteIcon sx={{ color: "#795548", mr: 1 }} />
                  Classic
                </MenuItem>
                <MenuItem value="modern">
                  <GridOnIcon sx={{ color: "#1976d2", mr: 1 }} />
                  Modern
                </MenuItem>
                <MenuItem value="wooden">
                  <TextureIcon sx={{ color: "#a1887f", mr: 1 }} />
                  Wooden
                </MenuItem>
              </Select>
            </FormControl>

            {/* Piece Set */}
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontSize: '0.875rem', color: 'text.primary' }}>
                Piece Set
              </FormLabel>
              <Select 
                value={pieceSet}
                onChange={(e) => handlePieceSetChange(e.target.value)}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="standard">
                  <EmojiEventsIcon sx={{ color: "#ffd600", mr: 1 }} />
                  Standard
                </MenuItem>
                <MenuItem value="fancy">
                  <StarIcon sx={{ color: "#f50057", mr: 1 }} />
                  Fancy
                </MenuItem>
                <MenuItem value="minimal">
                  <LensIcon sx={{ color: "#607d8b", mr: 1 }} />
                  Minimal
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Logout Button */}
          <Button 
            variant="contained" 
            color="error"
            startIcon={<ExitToAppIcon />}
            fullWidth
            sx={{ 
              mt: 2,
              borderRadius: 2,
              py: 1.2,
            }} 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog for Cache Clearing */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
          <WarningIcon color="warning" />
          <Typography fontWeight="bold">Warning: This Will Log You Out</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Clearing the cache will remove all stored data and log you out of the application. 
            You will need to log in again after this action.
            <br /><br />
            Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setConfirmDialogOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClearCacheConfirmed}
            variant="contained"
            color="warning"
            disabled={isClearing}
          >
            {isClearing ? 'Clearing...' : 'Clear Cache & Log Out'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;