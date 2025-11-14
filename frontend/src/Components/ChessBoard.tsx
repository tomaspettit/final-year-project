import React from 'react';
import { Box, Typography } from '@mui/material';
import type { Position, Piece } from '../Types/chess';

interface ChessBoardProps {
  board: (Piece | null)[][];
  selectedPosition: Position | null;
  legalMoves: Position[];
  onSquareClick: (row: number, col: number) => void;
}

const PIECE_SYMBOLS: Record<string, string> = {
  'white-king': '♔',
  'white-queen': '♕',
  'white-rook': '♖',
  'white-bishop': '♗',
  'white-knight': '♘',
  'white-pawn': '♙',
  'black-king': '♚',
  'black-queen': '♛',
  'black-rook': '♜',
  'black-bishop': '♝',
  'black-knight': '♞',
  'black-pawn': '♟',
};

export const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  selectedPosition,
  legalMoves,
  onSquareClick,
}) => {
  const isSquareSelected = (row: number, col: number) =>
    selectedPosition?.row === row && selectedPosition?.col === col;

  const isLegalMove = (row: number, col: number) =>
    legalMoves.some(pos => pos.row === row && pos.col === col);

  const isLightSquare = (row: number, col: number) => (row + col) % 2 === 0;

  return (
    <Box
      display="grid"
      gridTemplateRows={`repeat(${board.length}, 60px)`}
      gridTemplateColumns={`repeat(${board[0].length}, 60px)`}
      border={2}
      borderColor="grey.700"
      width="fit-content"
    >
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const bgColor = isLightSquare(rowIndex, colIndex)
            ? 'grey.100'
            : 'grey.700';
          const borderColor = isSquareSelected(rowIndex, colIndex)
            ? 'primary.main'
            : isLegalMove(rowIndex, colIndex)
            ? 'success.main'
            : 'transparent';

          return (
            <Box
              key={`${rowIndex}-${colIndex}`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor={bgColor}
              border={2}
              borderColor={borderColor}
              onClick={() => onSquareClick(rowIndex, colIndex)}
              sx={{
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {piece && (
                <Typography variant="h3">
                  {PIECE_SYMBOLS[`${piece.color}-${piece.type}`]}
                </Typography>
              )}
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default ChessBoard; // Classic Board Theme 