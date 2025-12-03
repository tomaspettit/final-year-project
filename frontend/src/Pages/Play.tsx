import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import GameSetup from '../Components/PlayComponents/GameSetup';
import GameScreen from '../Components/PlayComponents/GameScreen';
import type { GameMode } from '../Types/chess';
import Box from '@mui/material/Box';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from '@mui/material';

type Screen = 'setup' | 'game';

interface GameConfig {
  gameMode: GameMode;
  difficulty: number;
  timerEnabled: boolean;
  timerDuration: number;
}

const Play = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>('setup');
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    gameMode: 'ai',
    difficulty: 750,
    timerEnabled: false,
    timerDuration: 600
  });

  const handleStartGame = (config: GameConfig) => {
    setGameConfig(config);
    setCurrentScreen('game');
  };

  const handleBackToSetup = () => {
    setCurrentScreen('setup');
  };

  if (currentScreen === 'setup') {
    return (
    <Box>
      <IconButton sx={{ position: 'absolute', top: 16, left: 16, width: 40, height: 40 }} onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>
    <GameSetup onStartGame={handleStartGame} />
    </Box>
    );
  }

  return (
    <Box>
    <GameScreen
      gameMode={gameConfig.gameMode}
      difficulty={gameConfig.difficulty}
      timerEnabled={gameConfig.timerEnabled}
      timerDuration={gameConfig.timerDuration}
      onBackToSetup={handleBackToSetup}
    />
    </Box>
  );
}

export default Play;