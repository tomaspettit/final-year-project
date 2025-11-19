import React from "react";
import { Typography, Box, Tab, Card } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function Tutorial() {
  const [value, setValue] = React.useState('basic');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
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
      </Typography>

      <Box sx={{ width: "100%", typography: "body1", bgcolor: "blue", p: 3 }}>
        <TabContext value={value}>
          <Box sx={{ borderColor: "divider", display: "flex", justifyContent: "center"}}>
            <TabList onChange={handleChange} sx={{bgcolor: "black", borderRadius: 15}} aria-label="lab API tabs example">
              <Tab label="Basic" value="basic" />
              <Tab label="Pieces" value="pieces" />
              <Tab label="Rules" value="rules" />
              <Tab label="Winning" value="winning" />
              <Tab label="Draw" value="draw" />
            </TabList>
          </Box>

          <TabPanel value="basic">
            <Card className="p-6">
              <h2 className="text-3xl mb-4">What is Chess?</h2>
              <p className="mb-4">
                Chess is a strategic board game played between two players on an 8x8 checkered board. 
                It's one of the world's most popular games, combining tactics, strategy, and calculation.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-xl mb-2">Game Setup</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>64 squares (32 light, 32 dark)</li>
                    <li>16 pieces per player (White and Black)</li>
                    <li>White always moves first</li>
                    <li>Bottom-right square must be light colored</li>
                  </ul>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-xl mb-2">Objective</h3>
                  <p>
                    The goal is to checkmate your opponent's king. This means the king is under attack 
                    and has no legal move to escape capture.
                  </p>
                </div>
              </div>
            </Card>
          </TabPanel>
            <TabPanel value="pieces">How Each Piece Moves</TabPanel>
            <TabPanel value="rules">Essential Rules</TabPanel>
            <TabPanel value="winning">How to Win at Chess</TabPanel>
            <TabPanel value="draw">How a Game Can End in a Draw</TabPanel>
        </TabContext>
      </Box>
    </>
  );
}

export default Tutorial;
