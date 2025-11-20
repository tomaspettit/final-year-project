import type React from 'react';
import type { PieceColor, GameMode } from '../../Types/chess';
import { Button, Slider, Badge, Switch, Typography, Tabs, Tab, Box } from '@mui/material';

interface GameControlsProps {
  gameMode: GameMode;
  onGameModeChange: (mode: GameMode) => void;
  difficulty: number;
  onDifficultyChange: (difficulty: number) => void;
  timerEnabled: boolean;
  onTimerToggle: (enabled: boolean) => void;
  timerDuration: number;
  onTimerDurationChange: (duration: number) => void;
  onNewGame: () => void;
  onUndo: () => void;
  currentPlayer: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  winner: PieceColor | null;
  canUndo: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  onGameModeChange,
  difficulty,
  onDifficultyChange,
  timerEnabled,
  onTimerToggle,
  timerDuration,
  onTimerDurationChange,
  onNewGame,
  onUndo,
  currentPlayer,
  isCheck,
  isCheckmate,
  isStalemate,
  winner,
  canUndo
}: GameControlsProps) => {
  const getStatusMessage = () => {
    if (isCheckmate) {
      return `Checkmate! ${winner === 'white' ? 'White' : 'Black'} wins!`;
    }
    if (isStalemate) {
      return 'Stalemate! Game is a draw.';
    }
    if (isCheck) {
      return `${currentPlayer === 'white' ? 'White' : 'Black'} is in check!`;
    }
    return `${currentPlayer === 'white' ? 'White' : 'Black'}'s turn`;
  };
  
  const getDifficultyLevel = (value: number) => {
    if (value < 500) return 'Beginner';
    if (value < 1000) return 'Intermediate';
    if (value < 1500) return 'Advanced';
    return 'Expert';
  };

  const formatTimerDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (remainingMins === 0) return `${hours} hr`;
    return `${hours}h ${remainingMins}m`;
  };
  
  return (
    <Box className="space-y-6">
      <Box className="space-y-3">
        <Typography variant="h5" align="center">Chess Game</Typography>
        
        <Box className="flex items-center justify-center gap-2">
          <Badge 
            sx={{ml: 5, minWidth: 120}}
            color={currentPlayer === 'white' ? 'primary' : 'secondary'}
            badgeContent={getStatusMessage()}
          >
            <span style={{ width: 0, height: 0 }} />
          </Badge>
        </Box>
        
        {isCheck && !isCheckmate && (
          <Typography variant="body2" align="center" color="error">
            Check!
          </Typography>
        )}
      </Box>
      
      <Box className="space-y-3">
        <Box className="space-y-2">
          <Typography variant="body2" color="text.secondary">
            Game Mode
          </Typography>
          <Tabs 
            value={gameMode} 
            onChange={(event, value) => onGameModeChange(value as GameMode)}
            variant="fullWidth"
          >
            <Tab label="Player vs Player" value="pvp" />
            <Tab label="Player vs AI" value="ai" />
          </Tabs>
        </Box>
        
        {gameMode === 'ai' && (
          <Box className="space-y-3">
            <Box className="flex items-center justify-between">
              <Typography variant="body2" color="text.secondary">
                AI Difficulty
              </Typography>
              <Typography variant="body2">{getDifficultyLevel(difficulty)}</Typography>
            </Box>
            <Slider
              value={difficulty}
              onChange={(event, value) => onDifficultyChange(value as number)}
              min={250}
              max={2000}
              step={50}
              valueLabelDisplay="auto"
            />
            <Box className="flex justify-between text-xs text-muted-foreground">
            </Box>
          </Box>
        )}

        <Box className="space-y-3">
          <Box className="flex items-center justify-between">
            <Typography 
              variant="body2" 
              color="text.secondary"
              component="label"
              htmlFor="timer-toggle"
              sx={{ cursor: 'pointer' }}
            >
              Enable Timer
            </Typography>
            <Switch
              id="timer-toggle"
              checked={timerEnabled}
              onChange={(event) => onTimerToggle(event.target.checked)}
            />
          </Box>
          
          {timerEnabled && (
            <Box className="space-y-3">
              <Box className="flex items-center justify-between">
                <Typography variant="body2" color="text.secondary">
                  Time per Player
                </Typography>
                <Typography variant="body2">{formatTimerDuration(timerDuration)}</Typography>
              </Box>
              <Slider
                value={timerDuration}
                onChange={(event, value) => onTimerDurationChange(value as number)}
                min={60}
                max={3600}
                step={60}
                valueLabelDisplay="auto"
              />
              <Box className="flex justify-between text-xs text-muted-foreground">
              </Box>
            </Box>
          )}
        </Box>
        
        <Box className="flex gap-2">
          <Button 
            onClick={onNewGame}
            className="flex-1"
            variant="contained"
          >
            New Game
          </Button>
          <Button 
            onClick={onUndo}
            disabled={!canUndo || isCheckmate || isStalemate}
            variant="outlined"
          >
            Undo
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
        <Typography variant="body2"><strong>How to play:</strong></Typography>
        <ul style={{ color: 'black' }}>
          <li>Click a piece to select it</li>
          <li>Green dots show legal moves</li>
          <li>Click a highlighted square to move</li>
          {gameMode === 'ai' ? (
            <li>You play as White, AI plays as Black</li>
          ) : (
            <li>White starts, players alternate turns</li>
          )}
        </ul>
      </Box>
    </Box>
  );
};

export default GameControls;