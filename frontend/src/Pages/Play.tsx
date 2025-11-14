import { useState, useEffect, useRef } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import ChessBoard from '../Components/ChessBoard';
import GameControls from '../Components/GameControls';
import CapturedPieces from '../Components/CapturedPieces';
import MoveHistory from '../Components/MoveHistory';
import Timer from '../Components/Timer';
import AccuracyStats from '../Components/AccuracyStats';
import type { GameState, Position, Move, Piece, GameMode, TimerState } from '../Types/chess';
import {
  createInitialBoard,
  getLegalMoves,
  simulateMove,
  isCheckmate,
  isStalemate,
  isKingInCheck,
  getMoveNotation
} from '../Utils/chessLogic';
import { getAIMove, calculateMoveAccuracy } from '../Utils/chessAI';

const Play = () => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createInitialBoard(),
    currentPlayer: 'white',
    selectedPosition: null,
    legalMoves: [],
    moveHistory: [],
    capturedPieces: { white: [], black: [] },
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    winner: null
  }));

  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<number>(750);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(600);
  const [timer, setTimer] = useState<TimerState>({
    white: timerDuration,
    black: timerDuration,
    isActive: false
  });
  const timerIntervalRef = useRef<number | null>(null);

  // Timer countdown effect
  useEffect(() => {
    if (!timerEnabled || !timer.isActive || gameState.isCheckmate || gameState.isStalemate) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = window.setInterval(() => {
      setTimer(prev => {
        const currentPlayer = gameState.currentPlayer;
        const newTime = prev[currentPlayer] - 1;

        if (newTime <= 0) {
          setGameState(prevState => ({
            ...prevState,
            isCheckmate: true,
            winner: currentPlayer === 'white' ? 'black' : 'white'
          }));
          return { ...prev, [currentPlayer]: 0, isActive: false };
        }

        return { ...prev, [currentPlayer]: newTime };
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerEnabled, timer.isActive, gameState.currentPlayer, gameState.isCheckmate, gameState.isStalemate]);

  // AI move
  useEffect(() => {
    if (
      gameMode === 'ai' &&
      gameState.currentPlayer === 'black' &&
      !gameState.isCheckmate &&
      !gameState.isStalemate &&
      !isAIThinking
    ) {
      setIsAIThinking(true);
      setTimeout(() => {
        const aiMove = getAIMove(gameState.board, difficulty, 'black');
        if (aiMove) makeMove(aiMove.from, aiMove.to);
        setIsAIThinking(false);
      }, 300);
    }
  }, [gameMode, gameState.currentPlayer, gameState.isCheckmate, gameState.isStalemate]);

  const handleSquareClick = (row: number, col: number) => {
    if (gameMode === 'ai' && (gameState.currentPlayer === 'black' || isAIThinking)) return;
    if (gameState.isCheckmate || gameState.isStalemate) return;

    const clickedPiece = gameState.board[row][col];

    if (gameState.selectedPosition) {
      const isLegalMove = gameState.legalMoves.some(move => move.row === row && move.col === col);
      if (isLegalMove) {
        makeMove(gameState.selectedPosition, { row, col });
        return;
      }
    }

    if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
      const legalMoves = getLegalMoves(gameState.board, { row, col });
      setGameState(prev => ({ ...prev, selectedPosition: { row, col }, legalMoves }));
    } else {
      setGameState(prev => ({ ...prev, selectedPosition: null, legalMoves: [] }));
    }
  };

  const makeMove = (from: Position, to: Position) => {
    const piece = gameState.board[from.row][from.col];
    if (!piece) return;

    let accuracyData;
    const isHumanMove = gameMode === 'pvp' || (gameMode === 'ai' && piece.color === 'white');

    if (isHumanMove) accuracyData = calculateMoveAccuracy(gameState.board, { from, to }, piece.color);

    const capturedPiece = gameState.board[to.row][to.col];
    const newBoard = simulateMove(gameState.board, from, to);
    const notation = getMoveNotation(gameState.board, from, to);

    const move: Move = {
      from,
      to,
      piece,
      captured: capturedPiece || undefined,
      notation,
      ...(accuracyData && { accuracy: accuracyData.accuracy, accuracyClass: accuracyData.accuracyClass })
    };

    const newCapturedPieces = { ...gameState.capturedPieces };
    if (capturedPiece) newCapturedPieces[piece.color].push(capturedPiece);

    const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
    const isCheck = isKingInCheck(newBoard, nextPlayer);
    const isCheckmateState = isCheckmate(newBoard, nextPlayer);
    const isStalemateState = isStalemate(newBoard, nextPlayer);

    setGameState({
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedPosition: null,
      legalMoves: [],
      moveHistory: [...gameState.moveHistory, move],
      capturedPieces: newCapturedPieces,
      isCheck,
      isCheckmate: isCheckmateState,
      isStalemate: isStalemateState,
      winner: isCheckmateState ? gameState.currentPlayer : null
    });

    if (timerEnabled && gameState.moveHistory.length === 0) setTimer(prev => ({ ...prev, isActive: true }));
  };

  const handleNewGame = () => {
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 'white',
      selectedPosition: null,
      legalMoves: [],
      moveHistory: [],
      capturedPieces: { white: [], black: [] },
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      winner: null
    });
    setTimer({ white: timerDuration, black: timerDuration, isActive: false });
    setIsAIThinking(false);
  };

  const handleUndo = () => {
    const movesToUndo = gameMode === 'ai' ? 2 : 1;
    if (gameState.moveHistory.length < movesToUndo) return;

    const newHistory = gameState.moveHistory.slice(0, -movesToUndo);

    let newBoard = createInitialBoard();
    const newCapturedPieces = { white: [] as Piece[], black: [] as Piece[] };

    for (const move of newHistory) {
      if (move.captured) newCapturedPieces[move.piece.color].push(move.captured);
      newBoard = simulateMove(newBoard, move.from, move.to);
    }

    const nextPlayer = gameMode === 'ai' ? 'white' : (newHistory.length % 2 === 0 ? 'white' : 'black');
    const isCheck = isKingInCheck(newBoard, nextPlayer);

    setGameState({
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedPosition: null,
      legalMoves: [],
      moveHistory: newHistory,
      capturedPieces: newCapturedPieces,
      isCheck,
      isCheckmate: false,
      isStalemate: false,
      winner: null
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 4, bgcolor: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', overflowY: 'auto' }}>
      <Grid container spacing={4} alignItems="flex-start">
        {/* Left Panel - Controls */}
        <Grid>
          <Paper sx={{ p: 2, mb: 4, bgcolor: '#f8f1ff', borderRadius: 2, boxShadow: 6 }}>
            <GameControls
              gameMode={gameMode}
              onGameModeChange={mode => {
                setGameMode(mode);
                handleNewGame();
              }}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              timerEnabled={timerEnabled}
              onTimerToggle={enabled => {
                setTimerEnabled(enabled);
                setTimer({ white: timerDuration, black: timerDuration, isActive: false });
              }}
              timerDuration={timerDuration}
              onTimerDurationChange={setTimerDuration}
              onNewGame={handleNewGame}
              onUndo={handleUndo}
              currentPlayer={gameState.currentPlayer}
              isCheck={gameState.isCheck}
              isCheckmate={gameState.isCheckmate}
              isStalemate={gameState.isStalemate}
              winner={gameState.winner}
              canUndo={gameState.moveHistory.length >= (gameMode === 'ai' ? 2 : 1)}
            />
          </Paper>
          {timerEnabled && (
            <Paper sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 2, boxShadow: 6 }}>
              <Timer whiteTime={timer.white} blackTime={timer.black} currentPlayer={gameState.currentPlayer} isActive={timer.isActive} />
            </Paper>
          )}
        </Grid>

        {/* Center - Chess Board */}
        <Grid container justifyContent="center">
          <Box sx={{ position: 'relative' }}>
            <ChessBoard
              board={gameState.board}
              selectedPosition={gameState.selectedPosition}
              legalMoves={gameState.legalMoves}
              onSquareClick={handleSquareClick}
            />
            {isAIThinking && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(255,255,255,0.6)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#ff4081' }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  <Typography sx={{ color: 'white', fontWeight: 'bold' }}>AI is thinking...</Typography>
                </Paper>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Right Panel - Captured Pieces and Move History */}
        <Grid container direction="column" spacing={2}>
          <Grid>
            <CapturedPieces whiteCaptured={gameState.capturedPieces.white} blackCaptured={gameState.capturedPieces.black} />
          </Grid>
          <Grid>
            <MoveHistory moves={gameState.moveHistory} />
          </Grid>
          <Grid>
            <AccuracyStats moves={gameState.moveHistory} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Play;
