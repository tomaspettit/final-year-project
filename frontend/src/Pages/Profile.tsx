import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Box,
  Typography
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 3, textAlign: "center", maxWidth: 700, mx: "auto" }}>
      {/* Header with Settings Icon */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" color="#5500aa" fontWeight="bold">Profile</Typography>
        <IconButton onClick={() => navigate("/settings")} sx={{ color: "#5500aa" }}>
          <SettingsIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Profile;