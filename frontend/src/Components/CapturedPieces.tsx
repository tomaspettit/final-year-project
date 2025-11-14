import React from 'react';
import type { Piece } from '../Types/chess';

interface CapturedPiecesProps {
  whiteCaptured: Piece[];
  blackCaptured: Piece[];
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

const PIECE_VALUES = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0
};

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ whiteCaptured, blackCaptured }) => {
  const calculateAdvantage = () => {
    const whiteValue = whiteCaptured.reduce((sum, piece) => sum + PIECE_VALUES[piece.type], 0);
    const blackValue = blackCaptured.reduce((sum, piece) => sum + PIECE_VALUES[piece.type], 0);
    return blackValue - whiteValue;
  };
  
  const advantage = calculateAdvantage();
  
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Captured by White:</span>
            {advantage > 0 && (
              <span className="text-sm text-green-600">+{advantage}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1 min-h-[32px]">
            {blackCaptured.map((piece, index) => (
              <span 
                key={index} 
                className="text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]"
                style={{ fontSize: '24px', lineHeight: 1 }}
              >
                {PIECE_SYMBOLS[`${piece.color}-${piece.type}`]}
              </span>
            ))}
          </div>
        </div>
        
        <div className="border-t border-border" />
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Captured by Black:</span>
            {advantage < 0 && (
              <span className="text-sm text-green-600">+{Math.abs(advantage)}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1 min-h-[32px]">
            {whiteCaptured.map((piece, index) => (
              <span 
                key={index} 
                className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                style={{ fontSize: '24px', lineHeight: 1 }}
              >
                {PIECE_SYMBOLS[`${piece.color}-${piece.type}`]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapturedPieces;
