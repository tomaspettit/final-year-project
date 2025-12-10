import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameMode } from '../../Types/chess';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { Users, Bot, Crown, Clock } from 'lucide-react';
import { Box, Grid } from '@mui/material';

interface GameSetupProps {
  onStartGame: (config: {
    gameMode: GameMode;
    difficulty: number;
    timerEnabled: boolean;
    timerDuration: number;
  }) => void;
}

const GameSetup = ({ onStartGame }: GameSetupProps) => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<number>(750);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(600);

  const getDifficultyLabel = (value: number) => {
    if (value < 600) return 'Beginner';
    if (value < 1100) return 'Intermediate';
    if (value < 1600) return 'Advanced';
    return 'Expert';
  };

  const getTimerLabel = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const handleModeChange = (mode: GameMode) => {
    setSelectedMode(mode);
    // Enable timer by default when switching to PvP
    if (mode === 'pvp') {
      setTimerEnabled(true);
    } else {
      setTimerEnabled(false);
    }
  };

  const handleStartGame = () => {
    onStartGame({
      gameMode: selectedMode,
      difficulty,
      timerEnabled,
      timerDuration
    });
  };

  return (
    <Box
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #0f172a, #6d28d9, #0f172a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 8
      }}
    >
      <Box maxWidth="md" width="100%">
        <Box textAlign="center" mb={8}>
          {/* If you not ready to play, Tutorial Btn */}
          <Box mb={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/tutorial')}
            >
              Need Help? View Tutorial
            </Button>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" gap={3} mb={4}>
            <Crown className="w-12 h-12" style={{ color: '#facc15' }} />
            <Typography variant="h3" color="white">Are you ready to play?</Typography>
          </Box>
          <Typography color="text.secondary">Configure your game settings and start playing</Typography>
        </Box>

        <Card sx={{ p: 8, bgcolor: 'blue', borderColor: 'divider', backdropFilter: 'blur(4px)' }}>
          <CardContent>
            <Box display="flex" flexDirection="column" gap={8}>
              {/* Game Mode Selection */}
              <Box>
                <Typography variant="h6" color="white" mb={4}>Select Game Mode</Typography>
                <Grid container spacing={4}>
                  <Grid size={{xs:6}}>
                    <Button
                      onClick={() => handleModeChange('ai')}
                      variant={selectedMode === 'ai' ? 'contained' : 'outlined'}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        borderWidth: 2,
                        bgcolor: selectedMode === 'ai' ? 'primary.main' : 'background.paper',
                        color: 'white',
                        boxShadow: selectedMode === 'ai' ? 3 : 0,
                        width: '100%'
                      }}
                    >
                      <Box>
                        <Bot className="w-12 h-12 mx-auto mb-3" style={{ color: selectedMode === 'ai' ? '#a78bfa' : '#94a3b8' }} />
                        <Typography color="white" mb={1}>Play vs AI</Typography>
                        <Typography variant="body2" color="text.secondary">Challenge the computer</Typography>
                      </Box>
                    </Button>
                  </Grid>
                  <Grid size={{xs:6}}>
                    <Button
                      onClick={() => handleModeChange('pvp')}
                      variant={selectedMode === 'pvp' ? 'contained' : 'outlined'}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        borderWidth: 2,
                        bgcolor: selectedMode === 'pvp' ? 'primary.main' : 'background.paper',
                        color: 'white',
                        boxShadow: selectedMode === 'pvp' ? 3 : 0,
                        width: '100%'
                      }}
                    >
                      <Box>
                        <Users className="w-12 h-12 mx-auto mb-3" style={{ color: selectedMode === 'pvp' ? '#a78bfa' : '#94a3b8' }} />
                        <Typography color="white" mb={1}>Player vs Player</Typography>
                        <Typography variant="body2" color="text.secondary">Play with a friend</Typography>
                      </Box>
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* AI Difficulty (only shown for AI mode) */}
              {selectedMode === 'ai' && (
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography color="white">AI Difficulty</Typography>
                    <Typography color="primary">{getDifficultyLabel(difficulty)}</Typography>
                  </Box>
                  <Slider
                    value={difficulty}
                    onChange={(_, value) => setDifficulty(value as number)}
                    min={250}
                    max={2000}
                    step={50}
                    sx={{ width: '100%' }}
                  />
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="caption" color="text.secondary">Beginner</Typography>
                    <Typography variant="caption" color="text.secondary">Expert</Typography>
                  </Box>
                </Box>
              )}

              {/* Timer Settings */}
              {selectedMode === 'pvp' && (
                <Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Clock className="w-5 h-5" style={{ color: 'white' }} />
                      <Typography color="white">Enable Timer</Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={timerEnabled}
                          onChange={(_, checked) => setTimerEnabled(checked)}
                        />
                      }
                      label=""
                    />
                  </Box>

                  {timerEnabled && (
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography color="text.secondary">Time per player</Typography>
                        <Typography color="primary">{getTimerLabel(timerDuration)}</Typography>
                      </Box>
                      <Slider
                        value={timerDuration}
                        onChange={(_, value) => setTimerDuration(value as number)}
                        min={60}
                        max={1800}
                        step={60}
                        sx={{ width: '100%' }}
                      />
                      <Box display="flex" justifyContent="space-between" mt={2}>
                        <Typography variant="caption" color="text.secondary">1 min</Typography>
                        <Typography variant="caption" color="text.secondary">30 min</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Start Game Button */}
              <Button
                onClick={handleStartGame}
                variant="contained"
                color="primary"
                sx={{ width: '100%', height: 48, bgcolor: 'purple.600', ':hover': { bgcolor: 'purple.700' } }}
                size="large"
              >
                Start Game
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box mt={6} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Use drag & drop or click to move pieces
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default GameSetup;