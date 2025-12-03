import React from "react";
import { Typography, Box, Tab, Card, Button } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Crown, Trophy, Handshake, BookOpen, Swords, Sun, Moon } from 'lucide-react';
import { useTheme } from "../Context/ThemeContext";

function Tutorial() {
  const { isDark, toggleTheme } = useTheme();
  const [value, setValue] = React.useState('basic');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Typography
        variant="h4"
        color="primary"
        fontWeight="bold"
        sx={{ display: "flex", padding: 3, alignItems: "center" }}
      >
        ♟️Tutorial Page
        <Button onClick={toggleTheme} sx={{ mt: 2, ml: 2 }}>
                    {isDark ? <Sun /> : <Moon />}
                </Button>
      </Typography>

      <Box sx={{ width: "100%", typography: "body1", bgcolor: "blue", p: 3 }}>
        <TabContext value={value}>
          <Box sx={{ borderColor: "divider", display: "flex", justifyContent: "center"}}>
            <TabList onChange={handleChange} sx={{bgcolor: "grey", borderRadius: 15}} aria-label="lab API tabs example">
              {/* Each Tab representing a tutorial section with Icon*/}
              <Tab icon={<BookOpen />} iconPosition="start" label="Basic" value="basic" />
              <Tab icon={<Swords />} iconPosition="start" label="Pieces" value="pieces" />
              <Tab icon={<Handshake />} iconPosition="start" label="Rules" value="rules" />
              <Tab icon={<Crown />} iconPosition="start" label="Winning" value="winning" />
              <Tab icon={<Trophy />} iconPosition="start" label="Draw" value="draw" />
            </TabList>
          </Box>

          <TabPanel value="basic">
            <Card sx={{ p: 6 }}>
              <Typography variant="h5" gutterBottom>
                What is Chess?
              </Typography>
              <Typography>
                Chess is a strategic board game played between two players on an 8x8 checkered board. 
                It's one of the world's most popular games, combining tactics, strategy, and calculation.
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Game Setup
                  </Typography>
                  <ul style={{ marginLeft: 16 }}>
                    <li>64 squares (32 light, 32 dark)</li>
                    <li>16 pieces per player (White and Black)</li>
                    <li>White always moves first</li>
                    <li>Bottom-right square must be light colored</li>
                  </ul>
                </Card>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Objective
                  </Typography>
                  <Typography>
                    The goal is to checkmate your opponent's king. This means the king is under attack 
                    and has no legal move to escape capture.
                  </Typography>
                </Card>
              </Box>
            </Card>
          </TabPanel>
          <TabPanel value="pieces">
            <Card sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                How Each Piece Moves
              </Typography>
              {/* Add more MUI content here as needed */}
            </Card>
          </TabPanel>
          <TabPanel value="rules">
            <Card sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Essential Rules
              </Typography>
              {/* Add more MUI content here as needed */}
            </Card>
          </TabPanel>
          <TabPanel value="winning">
            <Card sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                How to Win at Chess
              </Typography>
              {/* Add more MUI content here as needed */}
            </Card>
          </TabPanel>
          <TabPanel value="draw">
            <Card sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                How a Game Can End in a Draw
              </Typography>
              {/* Add more MUI content here as needed */}
            </Card>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}

export default Tutorial;
