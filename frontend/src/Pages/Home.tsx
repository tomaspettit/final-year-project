import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getUserRatingAndHistories } from "../Utils/FirestoreService";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [histories, setHistories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
    // Fetch user's modules when the component mounts
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getUserRatingAndHistories(user.uid);
        setUserData(data);
        setHistories(data?.histories || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress sx={{ color: "#5500aa" }} />
      </Box>
    );
  }

    return(
    <Box sx={{ p: 3, pb: 10 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" color="#5500aa" fontWeight="bold" gutterBottom>
          Welcome, {userData?.name || "Chess Player"}!
        </Typography>
        {userData?.rating && (
          <Typography variant="body1" color="text.primary">
            Your Rating: {userData.rating}
          </Typography>
        )}
      </Box>
        {/* Study Histories Section */}
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5" color="#5500aa" fontWeight="bold" gutterBottom>
                Your Study Histories
            </Typography>
            <Button color="primary" onClick={() => navigate("/profile")} sx={{ fontWeight: "bold" }}>
                See All
            </Button>
            </Box>
        {histories.length === 0 ? (
          <Card
              sx={{
                width: "100%",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(85, 0, 170, 0.1)",
                p: 3,
                textAlign: "center",
              }}
            >
              <CardContent>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No recent found
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/play")}
                  sx={{ mt: 1, fontWeight: "bold", borderRadius: "8px" }}
                >
                  Play your first game
                </Button>
              </CardContent>
            </Card>
        ) : (
          // Render study histories here
          <Box>
            {/* Map through histories and display them */}
            {histories.map((history) => (
              <Card
                key={history.id}>
                {/* You can customize the content of each history card here */}
                <CardContent>
                  <Typography variant="body1">{history.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {history.date}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
    </Box>

    {/* Quick Info Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="#5500aa" gutterBottom>
          Quick Access
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, sm: 6}}>
            <Card
              sx={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(85, 0, 170, 0.1)",
                height: "100%",
                bgcolor: "#f8f5ff",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Tutorial
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                    Review your study the chess pieces 
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/tutorial")}
                    sx={{ alignSelf: "flex-start", fontWeight: "bold", borderRadius: "8px" }}
                  >
                    Open Tutorial
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{xs: 12, sm: 6}}>
            <Card
              sx={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(85, 0, 170, 0.1)",
                height: "100%",
                bgcolor: "#f8f5ff",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Invite Friends
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                    You can invite your friends to play with you
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/friends")}
                    sx={{ alignSelf: "flex-start", fontWeight: "bold", borderRadius: "8px" }}
                  >
                    Join Them
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Daily Tip */}
      <Card
        sx={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(85, 0, 170, 0.1)",
          bgcolor: "#5500aa",
          color: "white",
          mb: 5,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            💡 Daily Learning Tip
          </Typography>
          <Typography variant="body2">
            Consistent practice is key to improving your chess skills. Dedicate time each day to study tactics, openings, and endgames to see steady progress!
          </Typography>
        </CardContent>
      </Card>
    </Box>
    );
};

export default Home;