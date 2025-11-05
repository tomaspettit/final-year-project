import type { Board, PieceColor, Position} from '../Types/chess';
import { getAllLegalMoves, simulateMove, isCheckmate} from './chessLogic';

// Piece values for evaluation
const PIECE_VALUES = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000
};

// Positional bonuses for pieces
const POSITION_BONUS = {
  pawn: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  knight: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  bishop: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  rook: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
  ],
  queen: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  king: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

/* Evaluate board position for a given color */
function evaluateBoard(board: Board, color: PieceColor): number {
  let score = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      
      const pieceValue = PIECE_VALUES[piece.type];
      const positionValue = POSITION_BONUS[piece.type][piece.color === 'white' ? row : 7 - row][col];
      const totalValue = pieceValue + positionValue;
      
      if (piece.color === color) {
        score += totalValue;
      } else {
        score -= totalValue;
      }
    }
  }
  
  return score;
}

/* Minimax algorithm with alpha-beta pruning */
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  color: PieceColor
): number {
  const opponentColor = color === 'white' ? 'black' : 'white';
  
  if (depth === 0) {
    return evaluateBoard(board, color);
  }
  
  const currentColor = isMaximizing ? color : opponentColor;
  const moves = getAllLegalMoves(board, currentColor);
  
  if (moves.length === 0) {
    if (isCheckmate(board, currentColor)) {
      return isMaximizing ? -100000 : 100000;
    }
    return 0; // Stalemate
  }
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of moves) {
      const newBoard = simulateMove(board, move.from, move.to);
      const score = minimax(newBoard, depth - 1, alpha, beta, false, color);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of moves) {
      const newBoard = simulateMove(board, move.from, move.to);
      const score = minimax(newBoard, depth - 1, alpha, beta, true, color);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minScore;
  }
}

/* Main function to get AI move based on difficulty */
export function getAIMove(
  board: Board,
  difficulty: number,
  aiColor: PieceColor
): { from: Position; to: Position } | null {
  const allMoves = getAllLegalMoves(board, aiColor);
  
  if (allMoves.length === 0) return null;
  
  // Map difficulty (250-2000) to AI behavior
  if (difficulty < 600) {
    // Beginner: mostly random with slight preference for captures
    return getBeginnerMove(board, allMoves, aiColor);
  } else if (difficulty < 1100) {
    // Intermediate: basic evaluation with randomness
    return getIntermediateMove(board, allMoves, aiColor);
  } else if (difficulty < 1600) {
    // Advanced: depth-2 minimax
    return getHardMove(board, allMoves, aiColor, 2);
  } else {
    // Expert: depth-3 or 4 minimax based on difficulty
    const depth = difficulty >= 1800 ? 4 : 3;
    return getHardMove(board, allMoves, aiColor, depth);
  }
}

/* Purely random move */
function getRandomMove(moves: Array<{ from: Position; to: Position }>): { from: Position; to: Position } {
  return moves[Math.floor(Math.random() * moves.length)];
}

/* Prefer captures but mostly random */
function getBeginnerMove(
  board: Board,
  moves: Array<{ from: Position; to: Position }>,
  aiColor: PieceColor
): { from: Position; to: Position } {
  const captureMoves = moves.filter(move => {
    const targetPiece = board[move.to.row][move.to.col];
    return targetPiece && targetPiece.color !== aiColor;
  });
  
  // 70% chance to pick a capture move if available
  if (captureMoves.length > 0 && Math.random() < 0.7) {
    return captureMoves[Math.floor(Math.random() * captureMoves.length)];
  }
  
  return getRandomMove(moves);
}

/* Basic evaluation with randomness */
function getIntermediateMove(
  board: Board,
  moves: Array<{ from: Position; to: Position }>,
  aiColor: PieceColor
): { from: Position; to: Position } {
  // Evaluate each move and add some randomness
  const evaluatedMoves = moves.map(move => {
    const newBoard = simulateMove(board, move.from, move.to);
    const score = evaluateBoard(newBoard, aiColor);
    const randomFactor = Math.random() * 150 - 75; // Add ±75 random value
    return { move, score: score + randomFactor };
  });
  
  evaluatedMoves.sort((a, b) => b.score - a.score);
  
  // Pick from top 5 moves randomly
  const topMoves = evaluatedMoves.slice(0, Math.min(5, evaluatedMoves.length));
  const selected = topMoves[Math.floor(Math.random() * topMoves.length)];
  return selected.move;
}

/* Minimax algorithm to get best move */
function getHardMove(
  board: Board,
  moves: Array<{ from: Position; to: Position }>,
  aiColor: PieceColor,
  depth: number
): { from: Position; to: Position } {
  let bestMove = moves[0];
  let bestScore = -Infinity;
  
  for (const move of moves) {
    const newBoard = simulateMove(board, move.from, move.to);
    const score = minimax(newBoard, depth, -Infinity, Infinity, false, aiColor);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}
