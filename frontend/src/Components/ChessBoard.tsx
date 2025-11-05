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

/* ChessBoard Component */
export const ChessBoard: React.FC<ChessBoardProps> = ({ board, selectedPosition, legalMoves, onSquareClick }) => {
  const isSquareSelected = (row: number, col: number) => {
    return selectedPosition?.row === row && selectedPosition?.col === col;
  };
  
  // Check if a square is a legal move
  const isLegalMove = (row: number, col: number) => {
    return legalMoves.some(pos => pos.row === row && pos.col === col);
  };
  
  // Determine if square is light or dark
  const isLightSquare = (row: number, col: number) => {
    return (row + col) % 2 === 0;
    };
  
    return (
    <div className="chess-board">
        {board.map((row, rowIndex) => (
        <div key={rowIndex} className="chess-row">
            {row.map((piece, colIndex) => {
            const squareClasses = [
                'chess-square',
                isLightSquare(rowIndex, colIndex) ? 'light-square' : 'dark-square',
                isSquareSelected(rowIndex, colIndex) ? 'selected-square' : '',
                isLegalMove(rowIndex, colIndex) ? 'legal-move-square' : '',
            ].join(' ');
    
            return (
                <div
                key={colIndex}
                className={squareClasses}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                >
                {piece ? PIECE_SYMBOLS[`${piece.color}-${piece.type}`] : ''}
                </div>
            );
            })}
        </div>
        ))}
    </div>
    );
}
